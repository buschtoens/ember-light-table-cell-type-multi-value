import { get } from '@ember/object';
import { collect, reads } from '@ember/object/computed';
import { isArray } from '@ember/array';
import { computed } from 'ember-decorators/object';
import BaseCell from 'ember-light-table/components/cells/base';
import forceSet from 'ember-light-table-cell-type-multi-value/utils/force-set';

/**
 * @class MultiValueCell
 * @extends LightTable.BaseCell
 */
export default class extends BaseCell {
  /**
   * @property collectedValues;
   * @type {Ember.ComputedProperty}
   * @private;
   */
  collectedValues;

  /**
   * @property value
   * @type {Object|Object[]}
   */
  // TODO: Ideally we would use `rawValue` instead of `value`, so that this
  //   computed property is unnecessary, but that fucks up the `{{get}}`
  //   helper in `{{lt-row}}`.
  @computed('collectedValues')
  value(collectedValues) {
    const format = get(this, 'column.format');
    if (typeof format === 'function') {
      return format.call(this, collectedValues);
    }
    return collectedValues;
  }

  /**
   * @method didReceiveAttrs
   * @private
   */
  didReceiveAttrs() {
    // FIXME: https://github.com/rwjblue/ember-decorators/issues/120#issuecomment-314755414
    // super.didReceiveAttrs(...arguments);
    this._super(...arguments);

    const valuePaths = get(this, 'column.valuePaths');
    if (isArray(valuePaths)) {
      forceSet(this, 'collectedValues', collect(...valuePaths.map(p => `row.${p}`)));
    } else if (typeof valuePaths === 'string' || typeof valuePaths === 'number') {
      forceSet(this, 'collectedValues', reads(`row.${valuePaths}`));
    } else {
      const valuePath = get(this, 'column.valuePath');
      if (typeof valuePath === 'string' || typeof valuePath === 'number') {
        forceSet(this, 'collectedValues', reads(`row.${valuePath}`));
      } else {
        forceSet(this, 'collectedValues', null);
      }
    }
  }
}
