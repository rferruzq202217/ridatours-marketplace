// components/guias/ContentBlock.tsx
interface ContentBlockProps {
  block: {
    columns?: Array<{
      size?: string;
      richText?: any;
    }>;
  };
}

function renderRichText(richText: any): React.ReactNode {
  if (!richText?.root?.children) return null;

  return richText.root.children.map((node: any, index: number) => {
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {renderChildren(node.children)}
        </p>
      );
    }
    if (node.type === 'heading') {
      const Tag = `h${node.tag?.replace('h', '') || '2'}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag key={index} className="font-bold text-gray-900 mt-6 mb-3">
          {renderChildren(node.children)}
        </Tag>
      );
    }
    if (node.type === 'list') {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <ListTag key={index} className={`mb-4 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
          {node.children?.map((item: any, i: number) => (
            <li key={i} className="mb-2">{renderChildren(item.children)}</li>
          ))}
        </ListTag>
      );
    }
    return null;
  });
}

function renderChildren(children: any[]): React.ReactNode {
  if (!children) return null;
  return children.map((child: any, index: number) => {
    if (child.type === 'text') {
      let content: React.ReactNode = child.text;
      if (child.format & 1) content = <strong key={index}>{content}</strong>;
      if (child.format & 2) content = <em key={index}>{content}</em>;
      if (child.format & 4) content = <s key={index}>{content}</s>;
      if (child.format & 8) content = <u key={index}>{content}</u>;
      return content;
    }
    if (child.type === 'link') {
      return (
        <a key={index} href={child.fields?.url || '#'} className="text-green-600 hover:underline">
          {renderChildren(child.children)}
        </a>
      );
    }
    return null;
  });
}

export default function ContentBlock({ block }: ContentBlockProps) {
  if (!block.columns || block.columns.length === 0) return null;

  return (
    <div className="space-y-6">
      {block.columns.map((column, index) => (
        <div key={index}>
          {column.richText && renderRichText(column.richText)}
        </div>
      ))}
    </div>
  );
}
