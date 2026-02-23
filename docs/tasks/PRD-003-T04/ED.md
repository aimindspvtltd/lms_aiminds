# PRD-003-T04: Engineering Design - Content Block Implementation

## Overview

This document details the implementation of content blocks supporting videos, links, and interactive documents.

## Technical Architecture

### Content Type Handlers

Each content type will have a dedicated handler for validation, processing, and rendering:

```java
public interface ContentHandler {
    ContentType getType();
    void validateConfig(Map<String, Object> config);
    Map<String, Object> processConfig(Map<String, Object> config);
    Map<String, Object> enrichConfig(Map<String, Object> config);
}
```

### Implementation Details

## 1. Video Content Handler

### VideoContentHandler.java
```java
@Component
public class VideoContentHandler implements ContentHandler {
    
    private static final Pattern YOUTUBE_PATTERN = Pattern.compile(
        "(?:https?://)?(?:www\\.)?(?:youtube\\.com/watch\\?v=|youtu\\.be/)([\\w-]+)"
    );
    
    private static final Pattern VIMEO_PATTERN = Pattern.compile(
        "(?:https?://)?(?:www\\.)?vimeo\\.com/(\\d+)"
    );
    
    @Override
    public ContentType getType() {
        return ContentType.VIDEO;
    }
    
    @Override
    public void validateConfig(Map<String, Object> config) {
        String url = (String) config.get("url");
        if (!StringUtils.hasText(url)) {
            throw new ValidationException("Video URL is required");
        }
        
        VideoPlatform platform = detectPlatform(url);
        if (platform == null) {
            throw new ValidationException("Unsupported video URL. Supported: YouTube, Vimeo");
        }
    }
    
    @Override
    public Map<String, Object> processConfig(Map<String, Object> config) {
        String url = (String) config.get("url");
        VideoPlatform platform = detectPlatform(url);
        String videoId = extractVideoId(url, platform);
        
        config.put("platform", platform.name().toLowerCase());
        config.put("videoId", videoId);
        config.put("embedUrl", generateEmbedUrl(videoId, platform));
        
        return config;
    }
    
    @Override
    public Map<String, Object> enrichConfig(Map<String, Object> config) {
        // Fetch video metadata (title, duration, thumbnail)
        String platform = (String) config.get("platform");
        String videoId = (String) config.get("videoId");
        
        VideoMetadata metadata = fetchVideoMetadata(platform, videoId);
        config.put("duration", metadata.getDurationSeconds());
        config.put("thumbnailUrl", metadata.getThumbnailUrl());
        
        return config;
    }
    
    private VideoPlatform detectPlatform(String url) {
        if (YOUTUBE_PATTERN.matcher(url).find()) {
            return VideoPlatform.YOUTUBE;
        } else if (VIMEO_PATTERN.matcher(url).find()) {
            return VideoPlatform.VIMEO;
        }
        return null;
    }
    
    private String extractVideoId(String url, VideoPlatform platform) {
        Matcher matcher;
        switch (platform) {
            case YOUTUBE:
                matcher = YOUTUBE_PATTERN.matcher(url);
                return matcher.find() ? matcher.group(1) : null;
            case VIMEO:
                matcher = VIMEO_PATTERN.matcher(url);
                return matcher.find() ? matcher.group(1) : null;
            default:
                return null;
        }
    }
    
    private String generateEmbedUrl(String videoId, VideoPlatform platform) {
        switch (platform) {
            case YOUTUBE:
                return String.format("https://www.youtube-nocookie.com/embed/%s", videoId);
            case VIMEO:
                return String.format("https://player.vimeo.com/video/%s", videoId);
            default:
                return null;
        }
    }
}
```

### Video Metadata Service
```java
@Service
@Slf4j
public class VideoMetadataService {
    
    private final RestTemplate restTemplate;
    private final CacheManager cacheManager;
    
    @Cacheable(value = "videoMetadata", key = "#platform + ':' + #videoId")
    public VideoMetadata fetchMetadata(String platform, String videoId) {
        switch (platform.toUpperCase()) {
            case "YOUTUBE":
                return fetchYouTubeMetadata(videoId);
            case "VIMEO":
                return fetchVimeoMetadata(videoId);
            default:
                throw new UnsupportedOperationException("Platform not supported: " + platform);
        }
    }
    
    private VideoMetadata fetchYouTubeMetadata(String videoId) {
        // Use YouTube oEmbed API
        String url = String.format(
            "https://www.youtube.com/oembed?url=https://youtube.com/watch?v=%s&format=json",
            videoId
        );
        
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return VideoMetadata.builder()
                .title((String) response.get("title"))
                .thumbnailUrl((String) response.get("thumbnail_url"))
                .duration(parseDuration(response))
                .build();
        } catch (Exception e) {
            log.error("Failed to fetch YouTube metadata for video: " + videoId, e);
            return VideoMetadata.builder().build();
        }
    }
}
```

## 2. Link Content Handler

### LinkContentHandler.java
```java
@Component
public class LinkContentHandler implements ContentHandler {
    
    private final LinkMetadataService metadataService;
    
    @Override
    public void validateConfig(Map<String, Object> config) {
        String url = (String) config.get("url");
        if (!StringUtils.hasText(url)) {
            throw new ValidationException("Link URL is required");
        }
        
        try {
            new URL(url);
        } catch (MalformedURLException e) {
            throw new ValidationException("Invalid URL format");
        }
    }
    
    @Override
    public Map<String, Object> enrichConfig(Map<String, Object> config) {
        String url = (String) config.get("url");
        LinkMetadata metadata = metadataService.fetchMetadata(url);
        
        config.put("title", metadata.getTitle());
        config.put("description", metadata.getDescription());
        config.put("faviconUrl", metadata.getFaviconUrl());
        config.put("openInNewTab", config.getOrDefault("openInNewTab", true));
        
        return config;
    }
}
```

### Link Metadata Service
```java
@Service
public class LinkMetadataService {
    
    @Cacheable(value = "linkMetadata", key = "#url")
    public LinkMetadata fetchMetadata(String url) {
        try {
            Document doc = Jsoup.connect(url)
                .timeout(5000)
                .userAgent("Mozilla/5.0")
                .get();
            
            return LinkMetadata.builder()
                .title(extractTitle(doc))
                .description(extractDescription(doc))
                .faviconUrl(extractFavicon(doc, url))
                .build();
        } catch (Exception e) {
            log.warn("Failed to fetch metadata for URL: " + url, e);
            return LinkMetadata.builder()
                .title(url)
                .build();
        }
    }
    
    private String extractTitle(Document doc) {
        // Try Open Graph first
        String ogTitle = doc.select("meta[property=og:title]").attr("content");
        if (StringUtils.hasText(ogTitle)) {
            return ogTitle;
        }
        
        // Fall back to page title
        return doc.title();
    }
}
```

## 3. Document Content Handler

### DocumentContentHandler.java
```java
@Component
public class DocumentContentHandler implements ContentHandler {
    
    private final MarkdownProcessor markdownProcessor;
    private final FileStorageService fileStorageService;
    
    @Override
    public void validateConfig(Map<String, Object> config) {
        String content = (String) config.get("content");
        String format = (String) config.get("format");
        
        if (!StringUtils.hasText(content)) {
            throw new ValidationException("Document content is required");
        }
        
        if (!"markdown".equals(format) && !"html".equals(format)) {
            throw new ValidationException("Format must be 'markdown' or 'html'");
        }
        
        // Validate content size
        if (content.length() > 50000) {
            throw new ValidationException("Document content exceeds maximum size (50KB)");
        }
    }
    
    @Override
    public Map<String, Object> processConfig(Map<String, Object> config) {
        String content = (String) config.get("content");
        String format = (String) config.get("format");
        
        if ("markdown".equals(format)) {
            String html = markdownProcessor.toHtml(content);
            config.put("renderedHtml", sanitizeHtml(html));
        }
        
        // Process attachments
        List<Map<String, Object>> attachments = (List<Map<String, Object>>) config.get("attachments");
        if (attachments != null) {
            processAttachments(attachments);
        }
        
        return config;
    }
    
    private String sanitizeHtml(String html) {
        // Use OWASP HTML sanitizer
        PolicyFactory policy = new HtmlPolicyBuilder()
            .allowElements("h1", "h2", "h3", "h4", "h5", "h6")
            .allowElements("p", "div", "span", "br", "hr")
            .allowElements("ul", "ol", "li")
            .allowElements("a", "img")
            .allowElements("table", "thead", "tbody", "tr", "td", "th")
            .allowElements("code", "pre", "blockquote")
            .allowElements("strong", "em", "u", "strike")
            .allowAttributes("href").onElements("a")
            .allowAttributes("src", "alt", "width", "height").onElements("img")
            .allowAttributes("class").globally()
            .toFactory();
            
        return policy.sanitize(html);
    }
}
```

## Frontend Components

### VideoEmbed.tsx
```typescript
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface VideoEmbedProps {
  config: {
    embedUrl: string;
    platform: string;
    thumbnailUrl?: string;
    title: string;
  };
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ config }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden">
      {!loaded && config.thumbnailUrl && (
        <div 
          className="absolute inset-0 cursor-pointer group"
          onClick={() => setLoaded(true)}
        >
          <img 
            src={config.thumbnailUrl} 
            alt={config.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <PlayCircle className="w-16 h-16 text-white" />
          </div>
        </div>
      )}
      
      {loaded && (
        <iframe
          src={config.embedUrl}
          title={config.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </AspectRatio>
  );
};
```

### LinkPreview.tsx
```typescript
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LinkPreviewProps {
  config: {
    url: string;
    title?: string;
    description?: string;
    faviconUrl?: string;
    openInNewTab?: boolean;
  };
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ config }) => {
  const handleClick = () => {
    window.open(config.url, config.openInNewTab ? '_blank' : '_self');
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {config.faviconUrl ? (
          <img 
            src={config.faviconUrl} 
            alt="" 
            className="w-6 h-6 mt-1"
          />
        ) : (
          <ExternalLink className="w-5 h-5 mt-1 text-gray-400" />
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-1">
            {config.title || config.url}
          </h4>
          {config.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {config.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {new URL(config.url).hostname}
          </p>
        </div>
        
        {config.openInNewTab && (
          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
    </Card>
  );
};
```

### DocumentViewer.tsx
```typescript
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface DocumentViewerProps {
  config: {
    content: string;
    format: 'markdown' | 'html';
    renderedHtml?: string;
    attachments?: Array<{
      name: string;
      url: string;
      sizeBytes: number;
    }>;
  };
  editable?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ config, editable }) => {
  const [content, setContent] = useState(config.content);

  if (!editable && config.renderedHtml) {
    return (
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: config.renderedHtml }}
      />
    );
  }

  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </TabsTrigger>
        {editable && (
          <TabsTrigger value="edit">
            <FileText className="w-4 h-4 mr-2" />
            Edit
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="preview" className="mt-4">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </TabsContent>
      
      {editable && (
        <TabsContent value="edit" className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] p-4 font-mono text-sm border rounded-lg"
            placeholder="Enter Markdown content..."
          />
        </TabsContent>
      )}
    </Tabs>
  );
};
```

## Content Block Service

### ContentBlockService.java
```java
@Service
@RequiredArgsConstructor
@Transactional
public class ContentBlockService {
    
    private final ContentBlockRepository repository;
    private final Map<ContentType, ContentHandler> handlers;
    private final ContentBlockMapper mapper;
    
    @PostConstruct
    public void init() {
        // Wire handlers by type
        handlers = new HashMap<>();
        applicationContext.getBeansOfType(ContentHandler.class).values()
            .forEach(handler -> handlers.put(handler.getType(), handler));
    }
    
    public ContentBlockDto createContentBlock(Long moduleId, CreateContentBlockRequest request, Long userId) {
        Module module = moduleRepository.findById(moduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        
        // Validate config based on type
        ContentHandler handler = handlers.get(request.getType());
        handler.validateConfig(request.getConfig());
        
        // Process config
        Map<String, Object> processedConfig = handler.processConfig(request.getConfig());
        
        // Create entity
        ContentBlock block = ContentBlock.builder()
            .module(module)
            .type(request.getType())
            .title(request.getTitle())
            .sortOrder(request.getSortOrder())
            .config(processedConfig)
            .createdBy(userId)
            .updatedBy(userId)
            .build();
        
        block = repository.save(block);
        
        // Enrich config asynchronously
        CompletableFuture.runAsync(() -> {
            try {
                Map<String, Object> enrichedConfig = handler.enrichConfig(processedConfig);
                block.setConfig(enrichedConfig);
                repository.save(block);
            } catch (Exception e) {
                log.error("Failed to enrich content block config", e);
            }
        });
        
        return mapper.toDto(block);
    }
    
    @Transactional
    public void reorderContentBlocks(Long moduleId, List<Long> blockIds, Long userId) {
        Module module = moduleRepository.findById(moduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        
        List<ContentBlock> blocks = repository.findAllByModuleIdOrderBySortOrder(moduleId);
        
        // Validate all blocks belong to this module
        Set<Long> moduleBlockIds = blocks.stream()
            .map(ContentBlock::getId)
            .collect(Collectors.toSet());
        
        if (!moduleBlockIds.containsAll(blockIds)) {
            throw new BusinessException("Invalid block IDs for reordering");
        }
        
        // Update sort orders
        for (int i = 0; i < blockIds.size(); i++) {
            Long blockId = blockIds.get(i);
            ContentBlock block = blocks.stream()
                .filter(b -> b.getId().equals(blockId))
                .findFirst()
                .orElseThrow();
            
            block.setSortOrder(i + 1);
            block.setUpdatedBy(userId);
        }
        
        repository.saveAll(blocks);
    }
}
```

## Database Indexes

Add these indexes for performance:

```sql
-- Optimize content block queries
CREATE INDEX idx_content_blocks_module_sort 
ON content_blocks(module_id, sort_order);

-- Optimize JSON queries
CREATE INDEX idx_content_blocks_type_config 
ON content_blocks USING GIN (config jsonb_path_ops) 
WHERE type IN ('VIDEO', 'LINK');
```

## Caching Strategy

1. **Video Metadata**: Cache for 7 days
2. **Link Metadata**: Cache for 24 hours
3. **Rendered Markdown**: Cache until content changes

## Security Considerations

1. **Content Security Policy**:
   ```
   Content-Security-Policy: 
     frame-src https://www.youtube.com https://player.vimeo.com;
     img-src https: data:;
   ```

2. **URL Validation**: Whitelist allowed domains for embeds
3. **HTML Sanitization**: Strip dangerous tags and attributes
4. **File Upload**: Scan for malware, limit file types

## Error Handling

1. **Invalid Video URLs**: Show placeholder with error message
2. **Failed Metadata Fetch**: Use fallback title/description
3. **Embed Restrictions**: Detect and show "View on YouTube" link
4. **Network Errors**: Retry with exponential backoff