export default (): string[] => {
  const modules = import.meta.glob<{ default: string }>('@assets/home-imgs/*.{jpg,jpeg,png,webp,gif}', {eager: true})
  return Object.values(modules).map(m => m.default)
}