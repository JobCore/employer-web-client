import React, { Component } from "react";
import moment from "moment";
import Timeline from "react-calendar-timeline";
import 'react-calendar-timeline/lib/Timeline.css';

import generateFakeData from "./generate-fake-data";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end"
};

export default class ShiftTimeline extends Component {
  constructor(props) {
    super(props);

    const { groups, items } = generateFakeData();
    const defaultTimeStart = moment()
      .startOf("day")
      .toDate();
    const defaultTimeEnd = moment()
      .startOf("day")
      .add(1, "day")
      .toDate();

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd
    };
    this.animateScroll = this.animateScroll.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
  }

  animateScroll(invert){
    const width = (invert ? -1 : 1) * parseFloat(this.scrollRef.style.width); // cos curve in both directions
    const duration = 2000;

    const startTime = performance.now();
    let lastWidth = 0;
    const animate = () => {
      let normalizedTime = (performance.now() - startTime) / duration;
      if (normalizedTime > 1) {
        // not overanimate
        normalizedTime = 1;
      }

      // http://www.wolframalpha.com/input/?i=plot+0.5+(1%2Bcos(%CF%80+(x-1)))*1000+from+0+to+1 --> 1000 is the simulated width
      const calculatedWidth = Math.floor(
        width * 0.5 * (1 + Math.cos(Math.PI * (normalizedTime - 1)))
      );
      this.scrollRef.scrollLeft += calculatedWidth - lastWidth;
      lastWidth = calculatedWidth;

      if (normalizedTime < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  onPrevClick(){
    this.animateScroll(true);
  }

  onNextClick(){
    this.animateScroll(false);
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;

    return (
        <div>
            <Timeline
              scrollRef={el => (this.scrollRef = el)}
              groups={groups}
              items={items}
              keys={keys}
              sidebarContent={<div>Employee</div>}
              itemsSorted
              itemTouchSendsClick={false}
              stackItems
              itemHeightRatio={0.75}
              showCursorLine
              canMove={false}
              canResize={false}
              defaultTimeStart={defaultTimeStart}
              defaultTimeEnd={defaultTimeEnd}
            />
            <button onClick={this.onPrevClick}>{"< Prev"}</button>
            <button onClick={this.onNextClick}>{"Next >"}</button>
        </div>
    );
  }
}
