export function formatPlaceholderLabel(label: string): string {
  return `[Placeholder] ${label}`;
}

export function getRouteDisplayName(path: string): string {
  if (path === '/') {
    return 'Home';
  }
  const clean = path.replace(/^\/+/, '').replace(/-/g, ' ');
  return clean
    .split('/')
    .map((segment) =>
      segment
        .split(' ')
        .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
        .join(' '),
    )
    .join(' / ');
}
