import React from "react";
import { Meta } from "@storybook/react";
import { Markdown } from "./Markdown";

export default {
  title: "Markdown",
  component: Markdown
} as Meta;

export function Default() {
  return (
    <Markdown lastEditDate={new Date()} lastEditAuthor="John Doe">
      {`# Header 1

## Header 2

### Header 3

#### Header 4

# Two Paragraphs

Lorem ipsum dolor [sit amet](#), consectetur adipiscing elit. Aenean convallis lorem eu volutpat congue. Cras rutrum porta nisi, vel hendrerit ante. Quisque imperdiet semper lectus ut luctus. Mauris eu sollicitudin erat, sit amet consequat tortor. Nam quis placerat nisi. Proin ornare dui vel quam luctus, rutrum mollis lectus tincidunt. Maecenas commodo maximus nisi, quis gravida urna lobortis ac. In ac eleifend felis, vel tincidunt elit. Donec consectetur sapien quis lacus congue congue. Fusce sagittis aliquam ex. Etiam euismod, orci sit amet vulputate rhoncus, lacus tellus blandit sem, id tristique lectus massa commodo nibh. Nunc varius lorem mattis enim laoreet imperdiet laoreet at mi.

Donec felis ex, auctor a ligula quis, mollis sollicitudin libero. Aliquam vitae egestas quam. Vivamus porta suscipit eros, a hendrerit mi finibus vel. Sed vestibulum ante vel lacinia pellentesque. Integer elementum ultricies ante, vel gravida arcu faucibus et. Nunc tristique egestas pellentesque. Morbi volutpat dictum mi, quis ultricies leo. Morbi rhoncus malesuada lectus ut egestas. Phasellus finibus sodales nunc vel blandit. In tellus augue, posuere non libero eget, rhoncus tempus dui. Proin consequat libero ac felis volutpat, nec tempor ipsum dapibus. In vitae arcu efficitur, venenatis ipsum sit amet, tempus massa.

# Lists

## Unordered

- Item
- Item
- Item

## Ordered

1. Item
2. Item
3. Item
`}
    </Markdown>
  );
}
