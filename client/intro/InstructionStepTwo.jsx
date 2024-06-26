import React from "react";

import { Centered } from "meteor/empirica:core";

export default class InstructionStepTwo extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev } = this.props;
    return (
      <Centered>
        <div id="instructions">
          <h1> Instructions 2 </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio,
            animi? Quae autem asperiores officiis voluptatum fuga recusandae
            minima! Animi pariatur ex sapiente laborum. Ipsa quo quia ab,
            veritatis et labore.
          </p>

          <p>
            <button
              name="prev-button"
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
            >
              Previous
            </button>
            <button
              name="next-button"
              type="button"
              onClick={onNext}
              disabled={!hasNext}
            >
              Next
            </button>
          </p>
        </div>
      </Centered>
    );
  }
}
