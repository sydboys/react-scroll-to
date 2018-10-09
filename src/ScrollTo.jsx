import React, { Component, createContext } from "react";

export const ScrollToContext = createContext("scrollToContext");

/**
 * Component that uses render props to inject
 * a function that allows the consumer to scroll to a
 * position in the window or ScrollArea component
 */
class ScrollTo extends Component {
  constructor(props) {
    super(props);

    this.scrollArea = {};

    this.getContext = {
      addScrollArea: (id, ref) => {
        this.scrollArea[id] = ref;
      },
      removeScrollArea: id => {
        delete this.scrollArea[id];
      }
    };
  }

  handleScroll = (props = {}) => {
    const scrollAreaKeys = Object.keys(this.scrollArea);
    const { id, ...rest } = props;

    if (id) {
      const node = this.scrollArea[id];

      this._scrollNode(node, rest);
    } else if (scrollAreaKeys.length === 0) {
      this._scrollNode(window, rest);
    } else {
      scrollAreaKeys.forEach(key => {
        const node = this.scrollArea[key];

        this._scrollNode(node, rest);
      });
    }
  };

  _scrollNode = (node, options) => {
    if (!node) {
      return;
    }

    const top = options.y;
    const left = options.x;

    if (node.scrollTo) {
      node.scrollTo({
        top,
        left,
        behavior: options.smooth ? "smooth" : "auto"
      });
    } else {
      node.scrollLeft = left;
      node.scrollTop = top;
    }
  };

  render() {
    return (
      <ScrollToContext.Provider value={this.getContext}>
        {this.props.children &&
          this.props.children({
            scrollTo: this.handleScroll
          })}
      </ScrollToContext.Provider>
    );
  }
}

ScrollTo.defaultProps = {
  children: () => {}
};

export default ScrollTo;
