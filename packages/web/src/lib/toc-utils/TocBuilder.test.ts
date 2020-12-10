import { Toc } from "./Toc";
import { TocSection } from "./TocSection";
import { TocBuilder } from "./TocBuilder";

type TocRep = {
  level: number;
  title: string;
  children: TocRep[];
};
const tocToArray = (section: TocSection | Toc): TocRep[] => {
  return section.children.map((child) => {
    return {
      level: child.getLevel(),
      title: child.title,
      children: tocToArray(child)
    };
  });
};

describe("TocBuilder", () => {
  it("should add sections to the TOC correctly", () => {
    const builder = new TocBuilder();
    builder.addSection(1, "Header 1", "Header1");
    builder.addSection(2, "Header 1.1", "Header1.1");
    builder.addSection(3, "Header 1.1.1", "Header1.1.1");
    builder.addSection(4, "Header 1.1.1.1", "Header1.1.1.1");
    builder.addSection(5, "Header 1.1.1.1.1", "Header1.1.1.1.1");
    builder.addSection(6, "Header 1.1.1.1.1.1", "Header1.1.1.1.1.1");
    builder.addSection(2, "Header 1.2", "Header1.2");
    builder.addSection(3, "Header 1.2.1", "Header1.2.1");
    builder.addSection(3, "Header 1.2.2", "Header1.2.2");
    builder.addSection(3, "Header 1.2.3", "Header1.2.3");
    builder.addSection(1, "Header 2", "Header2");
    builder.addSection(1, "Header 3", "Header3");

    const toc = builder.getToc();
    expect(tocToArray(toc)).toEqual([
      {
        level: 1,
        title: "Header 1",
        children: [
          {
            level: 2,
            title: "Header 1.1",
            children: [
              {
                level: 3,
                title: "Header 1.1.1",
                children: [
                  {
                    level: 4,
                    title: "Header 1.1.1.1",
                    children: [
                      {
                        level: 5,
                        title: "Header 1.1.1.1.1",
                        children: [
                          {
                            level: 6,
                            title: "Header 1.1.1.1.1.1",
                            children: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            level: 2,
            title: "Header 1.2",
            children: [
              {
                level: 3,
                title: "Header 1.2.1",
                children: []
              },
              {
                level: 3,
                title: "Header 1.2.2",
                children: []
              },
              {
                level: 3,
                title: "Header 1.2.3",
                children: []
              }
            ]
          }
        ]
      },
      {
        level: 1,
        title: "Header 2",
        children: []
      },
      {
        level: 1,
        title: "Header 3",
        children: []
      }
    ]);
  });

  it("debug", () => {
    const builder = new TocBuilder();
    builder.addSection(1, "Header 1", "Header1");
    builder.addSection(2, "Header 1.1", "Header1.1");
    builder.addSection(3, "Header 1.1.1", "Header1.1.1");
    builder.addSection(4, "Header 1.1.1.1", "Header1.1.1.1");
    builder.addSection(1, "Header 2", "Header2");
    builder.addSection(1, "Header 3", "Header3");
    builder.addSection(2, "Header 3.1", "Header3.1");
    builder.addSection(2, "Header 3.2", "Header3.2");

    const toc = builder.getToc();
    expect(toc.children.length).toBeGreaterThan(0);
  });
});
