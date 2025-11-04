interface BreadcrumbProps {
  industryName: string
}

export default function Breadcrumb({ industryName }: BreadcrumbProps) {
  return (
    <div className="text-sm text-muted-foreground">
      <a href="/" className="hover:text-foreground transition-colors">
        Home
      </a>
      <span className="mx-2">/</span>
      <span>Play</span>
      <span className="mx-2">/</span>
      <span className="text-foreground font-semibold">{industryName}</span>
    </div>
  )
}
