import Ember from 'ember';
import { defineProperty } from '@ember/object';

const { propertyDidChange, propertyWillChange } = Ember;

/**
 * Behaves just like[`Ember.set(obj, keyName, value)`](https://www.emberjs.com/api/ember/2.14/namespaces/Ember/methods/set?anchor=set),
 * however it is also capable of overwriting / replacing read-only computed
 * properties.
 *
 * This is required to update computed properties at run time.
 *
 * For more information, see [this Twiddle](https://ember-twiddle.com/2d505ae4881ff5703611586fc5e57543)
 * or [this Slack conversation](https://embercommunity.slackarchive.io/general/page-100/ts-1500544052814073).
 *
 * @method forceSet
 * @param  {Ember.Object} obj     The object to modify.
 * @param  {String}       keyName The property key to set.
 * @param  {Object}       value   The value to set.
 * @return {Object} The passed value.
 * @private
 */
export default function forceSet(obj, keyName, value) {
  propertyWillChange(obj, keyName);
  defineProperty(obj, keyName, value);
  propertyDidChange(obj, keyName);
  return value;
}
