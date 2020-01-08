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
    "EXPORT_CLIPS",
    {
      title: "Export Clips on The List",
      filters: [
        { name: "Pastify File", extensions: ["pastify"] },
        { name: "All Files", extensions: ["*"] }
      ]
    }
  ]
]);
