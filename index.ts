'use strict';

import { Minimatch, IMinimatch } from 'minimatch';

export = class MatcherCollection {
  private matchers: IMinimatch[];

  constructor(matchers: (IMinimatch | string)[]) {
    this.matchers = matchers.map(matcher => {
      return typeof matcher === 'string' ? new Minimatch(matcher) : matcher;
    });
  }

  match(value: string) {
    for (let i = 0; i < this.matchers.length; i++) {
      if (this.matchers[i].match(value)) {
        return true;
      }
    }

    return false;
  }

  mayContain(value: string) {
    let parts = value.split(/\/|\\/g).filter(Boolean);
    for (let i = 0; i < this.matchers.length; i++) {
      let matcher = this.matchers[i];
      for (let j = 0; j < matcher.set.length; j++) {
        if (matcher.matchOne(parts, matcher.set[j], true)) {
          return true;
        }
      }
    }

    return false;
  };
};
