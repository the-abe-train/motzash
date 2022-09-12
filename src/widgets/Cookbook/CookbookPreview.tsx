import Meat from "../../assets/icons/Meat.svg";
import Dairy from "../../assets/icons/Dairy.svg";
import Pareve from "../../assets/icons/Pareve.svg";
import { For } from "solid-js";

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

  type Data = {
    name: string;
    img: string;
    key: keyof typeof cookbook;
  };

  const data: Data[] = [
    { name: "Meat", img: Meat, key: "meat" },
    { name: "Dairy", img: Dairy, key: "dairy" },
    { name: "Pareve", img: Pareve, key: "pareve" },
  ];

  return (
    <For each={data}>
      {(category) => {
        return (
          <div
            class="bg-white p-2 w-full flex space-x-2
      border border-black rounded"
          >
            <img src={category.img} alt={category.name} />
            <p>
              {category.name} ({cookbook[category.key]} recipes)
            </p>
          </div>
        );
      }}
    </For>
  );
};

export default CookbookPreview;
