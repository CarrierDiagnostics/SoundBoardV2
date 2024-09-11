import * as FileSystem from 'expo-file-system';

export async function writeJSON(exportData, fN) {
  await FileSystem.writeAsStringAsync(
    FileSystem.documentDirectory + fN + "Data.json",
    JSON.stringify(exportData)
  );
}

export async function readJSON(fN) {
  const data = await FileSystem.readAsStringAsync(
    FileSystem.documentDirectory + fN + "Data.json"
  );
  return JSON.parse(data);
}