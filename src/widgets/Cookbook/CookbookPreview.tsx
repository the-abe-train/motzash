const CookbookPreview: WidgetPreviewComponent = (props) => {
  const cookbook = props.widgets.reduce(
    (book, widget) => {
      switch (widget.type) {
        case "dairy_recipe":
          book["dairy"]++;
          break;
        case "meat_recipe":
          book["meat"]++;
          break;
        case "pareve_recipe":
          book["pareve"]++;
          break;
      }
      return book;
    },
    { meat: 0, dairy: 0, pareve: 0 }
  );
  console.log(cookbook);

  return (
    <div>
      <div class="bg-white p-2 w-full">
        <p>Meat ({cookbook["meat"]} recipes)</p>
      </div>
      <div class="bg-white p-2 w-full">
        <p>Dairy ({cookbook["dairy"]} recipes)</p>
      </div>
      <div class="bg-white p-2 w-full">
        <p>Pareve ({cookbook["pareve"]} recipes)</p>
      </div>
    </div>
  );
};

export default CookbookPreview;
