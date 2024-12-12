import React from "react";
import { Meta } from "@storybook/react";
import { Typography } from "@material-ui/core";
import { TwoColContent } from "./TwoColContent";

export default {
  title: "TwoColContent",
  component: TwoColContent
} as Meta;

export function OneColumn() {
  return (
    <TwoColContent>
      <Typography variant="h3" gutterBottom>
        Lorem Ipsum
      </Typography>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
        convallis lorem eu volutpat congue. Cras rutrum porta nisi, vel
        hendrerit ante. Quisque imperdiet semper lectus ut luctus. Mauris eu
        sollicitudin erat, sit amet consequat tortor. Nam quis placerat nisi.
        Proin ornare dui vel quam luctus, rutrum mollis lectus tincidunt.
        Maecenas commodo maximus nisi, quis gravida urna lobortis ac. In ac
        eleifend felis, vel tincidunt elit. Donec consectetur sapien quis lacus
        congue congue. Fusce sagittis aliquam ex. Etiam euismod, orci sit amet
        vulputate rhoncus, lacus tellus blandit sem, id tristique lectus massa
        commodo nibh. Nunc varius lorem mattis enim laoreet imperdiet laoreet at
        mi.
      </Typography>
      <Typography>
        Donec felis ex, auctor a ligula quis, mollis sollicitudin libero.
        Aliquam vitae egestas quam. Vivamus porta suscipit eros, a hendrerit mi
        finibus vel. Sed vestibulum ante vel lacinia pellentesque. Integer
        elementum ultricies ante, vel gravida arcu faucibus et. Nunc tristique
        egestas pellentesque. Morbi volutpat dictum mi, quis ultricies leo.
        Morbi rhoncus malesuada lectus ut egestas. Phasellus finibus sodales
        nunc vel blandit. In tellus augue, posuere non libero eget, rhoncus
        tempus dui. Proin consequat libero ac felis volutpat, nec tempor ipsum
        dapibus. In vitae arcu efficitur, venenatis ipsum sit amet, tempus
        massa.
      </Typography>
    </TwoColContent>
  );
}

export function TwoColumns() {
  return (
    <TwoColContent rightColContent={<Typography>Some content</Typography>}>
      <Typography variant="h3" gutterBottom>
        Lorem Ipsum
      </Typography>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
        convallis lorem eu volutpat congue. Cras rutrum porta nisi, vel
        hendrerit ante. Quisque imperdiet semper lectus ut luctus. Mauris eu
        sollicitudin erat, sit amet consequat tortor. Nam quis placerat nisi.
        Proin ornare dui vel quam luctus, rutrum mollis lectus tincidunt.
        Maecenas commodo maximus nisi, quis gravida urna lobortis ac. In ac
        eleifend felis, vel tincidunt elit. Donec consectetur sapien quis lacus
        congue congue. Fusce sagittis aliquam ex. Etiam euismod, orci sit amet
        vulputate rhoncus, lacus tellus blandit sem, id tristique lectus massa
        commodo nibh. Nunc varius lorem mattis enim laoreet imperdiet laoreet at
        mi.
      </Typography>
      <Typography>
        Donec felis ex, auctor a ligula quis, mollis sollicitudin libero.
        Aliquam vitae egestas quam. Vivamus porta suscipit eros, a hendrerit mi
        finibus vel. Sed vestibulum ante vel lacinia pellentesque. Integer
        elementum ultricies ante, vel gravida arcu faucibus et. Nunc tristique
        egestas pellentesque. Morbi volutpat dictum mi, quis ultricies leo.
        Morbi rhoncus malesuada lectus ut egestas. Phasellus finibus sodales
        nunc vel blandit. In tellus augue, posuere non libero eget, rhoncus
        tempus dui. Proin consequat libero ac felis volutpat, nec tempor ipsum
        dapibus. In vitae arcu efficitur, venenatis ipsum sit amet, tempus
        massa.
      </Typography>
    </TwoColContent>
  );
}

export function TwoColumnsWithTitle() {
  return (
    <TwoColContent
      rightColContent={<Typography>Some content</Typography>}
      rightColTitle="Column title"
    >
      <Typography variant="h3" gutterBottom>
        Lorem Ipsum
      </Typography>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
        convallis lorem eu volutpat congue. Cras rutrum porta nisi, vel
        hendrerit ante. Quisque imperdiet semper lectus ut luctus. Mauris eu
        sollicitudin erat, sit amet consequat tortor. Nam quis placerat nisi.
        Proin ornare dui vel quam luctus, rutrum mollis lectus tincidunt.
        Maecenas commodo maximus nisi, quis gravida urna lobortis ac. In ac
        eleifend felis, vel tincidunt elit. Donec consectetur sapien quis lacus
        congue congue. Fusce sagittis aliquam ex. Etiam euismod, orci sit amet
        vulputate rhoncus, lacus tellus blandit sem, id tristique lectus massa
        commodo nibh. Nunc varius lorem mattis enim laoreet imperdiet laoreet at
        mi.
      </Typography>
      <Typography>
        Donec felis ex, auctor a ligula quis, mollis sollicitudin libero.
        Aliquam vitae egestas quam. Vivamus porta suscipit eros, a hendrerit mi
        finibus vel. Sed vestibulum ante vel lacinia pellentesque. Integer
        elementum ultricies ante, vel gravida arcu faucibus et. Nunc tristique
        egestas pellentesque. Morbi volutpat dictum mi, quis ultricies leo.
        Morbi rhoncus malesuada lectus ut egestas. Phasellus finibus sodales
        nunc vel blandit. In tellus augue, posuere non libero eget, rhoncus
        tempus dui. Proin consequat libero ac felis volutpat, nec tempor ipsum
        dapibus. In vitae arcu efficitur, venenatis ipsum sit amet, tempus
        massa.
      </Typography>
    </TwoColContent>
  );
}
