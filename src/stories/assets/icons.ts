// Loads all the icon files
const iconFiles = import.meta.glob("../../assets/icons/*.svg", { eager: true });

// Retrieve the icon name from the file path
export const icons: string[] = Object.keys(iconFiles)
  .map((path) => path.match(/\/([^/]+)\.svg$/)?.[1])
  .filter((path): path is string => Boolean(path));
