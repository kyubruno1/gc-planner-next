export function getEquipImagePath(fileName: string): string {
  const cleanedName = fileName.startsWith("visual-")
    ? fileName.replace("visual-", "")
    : fileName;

  return `/assets/images/equip-clean/${cleanedName}`;
}
