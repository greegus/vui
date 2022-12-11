// Loads all the icon files
const iconFiles = import.meta.glob('../icons/*.vue', { eager: true })

// Retrieve the icon name from the file path
export const icons: string[] = Object.keys(iconFiles).map((path) => path.match(/\/([^/]+)\.vue$/)![1])
