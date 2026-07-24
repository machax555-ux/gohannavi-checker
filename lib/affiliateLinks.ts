// Amazon Affiliate and Gohannavi Blog Link Generator

export function generateAmazonLink(blogKeyword: string): string {
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(blogKeyword)}+無添加&tag=gohannavi-22`;
}

export function generateBlogLink(blogKeyword: string): string {
  return `https://gohannavi.com/?s=${encodeURIComponent(blogKeyword)}`;
}
