module.exports = new Map([
  [
    "DELETE_FAVED_CLIP",
    {
      type: "info",
      buttons: ["OK", "Cancel"],
      title: "タイトル",
      message: "Remove Item",
      detail: "You will remove faved item. you sure you want to do this?"
      // checkboxLabel: "Do not display this dialog again."
    }
  ],
  [
    "TRASH_ALL",
    {
      type: "info",
      buttons: ["Yes (but Excluding Faved Clips)", "Yes ", "Cancel "],
      cancelId: 2,
      message: "Trash All Clips",
      detail: "You will trash all clips on list. you sure you want to do this?"
      // checkboxLabel: "Do not display this dialog again."
    }
  ],
  [
    "DELETE_ALL_TRASHED_CLIPS",
    {
      type: "info",
      buttons: ["Yes", "no"],
      cancelId: 1,
      message: "Delete All Trashed Clips",
      detail: "You will delete all trashed clips. you sure you want to do this?"
      // checkboxLabel: "Do not display this dialog again."
    }
  ],
  [
    "EXPORT_CLIPS",
    {
      title: "Export Clips on The List",
      filters: [
        { name: "Pastify File", extensions: ["pastify"] },
        { name: "All Files", extensions: ["*"] }
      ]
    }
  ],
  [
    "IMPORT_CLIPS",
    {
      title: "Import Clips",
      filters: [
        { name: "Pastify File", extensions: ["pastify"] },
        { name: "All Files", extensions: ["*"] }
      ]
    }
  ]
]);
