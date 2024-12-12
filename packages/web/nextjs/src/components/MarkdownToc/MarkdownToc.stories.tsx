import React from "react";
import { Meta } from "@storybook/react";
import { compiler as mdCompiler } from "markdown-to-jsx";
import { MarkdownHeading } from "../MarkdownHeading";
import { MarkdownToc } from "./MarkdownToc";

const markdown = `# Header 1
Lorem Ipsum

## Header 1.1

### Header 1.1.1

### Header 1.1.2

## Header 1.2

#### Subtitle without direct parent

test

# Header 2

hello`;

const options = {
  overrides: {
    h1: {
      component: MarkdownHeading,
      props: { variant: "h1" }
    },
    h2: {
      component: MarkdownHeading,
      props: { variant: "h2" }
    },
    h3: {
      component: MarkdownHeading,
      props: { variant: "h3" }
    },
    h4: {
      component: MarkdownHeading,
      props: { variant: "h4" }
    }
  }
};

const content = mdCompiler(markdown, options) as React.ReactElement<{
  children: React.ReactElement;
}>;

export default {
  title: "MarkdownToc",
  component: MarkdownToc
} as Meta;

export function Default() {
  return <MarkdownToc content={content.props.children} />;
}
