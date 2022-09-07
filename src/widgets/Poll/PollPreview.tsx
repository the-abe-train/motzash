const PollPreview: WidgetPreviewComponent = (props) => {
  const polls = props.widgets.filter((widget) => widget.type === "poll");
  const myPoll = polls.length > 0 ? polls[0].name : "Create new poll";
  return (
    <div class="bg-white p-2 w-full">
      <p>{myPoll}</p>
    </div>
  );
};

export default PollPreview;
