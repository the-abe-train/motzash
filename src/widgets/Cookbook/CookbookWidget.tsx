import { createResource } from "solid-js";
import { loadRecipe } from "../../util/queries";

const CookbookWidget: WidgetComponent = (props) => {
  const [loadedTodos, { refetch }] = createResource(async () =>
    loadRecipe(props.widget.id)
  );
  return (
    <div>
      <h2 class="text-lg">{props.widget.name}</h2>
      <div>
        <h3>Ingredients</h3>
        <ul>
          <li>Ing 1</li>
        </ul>
      </div>
      <div>
        <h3>Instructions</h3>
        <ol>
          <li>Step 1</li>
        </ol>
      </div>
    </div>
  );
};

export default CookbookWidget;
