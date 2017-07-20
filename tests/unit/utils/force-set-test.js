import forceSet from 'ember-light-table-cell-type-multi-value/utils/force-set';
import { module, test } from 'qunit';
import EmberObject, { get, set } from '@ember/object';
import { readOnly } from '@ember/object/computed';

module('Unit | Utility | force set');

test('it works', function(assert) {
  const obj = EmberObject.create({
    foo: 'bar',
    quux: 'quax'
  });

  forceSet(obj, 'computed', readOnly('foo'));
  assert.equal(get(obj, 'foo'), get(obj, 'computed'), 'runtime computed property was correctly created');

  set(obj, 'foo', 'baz');
  assert.equal(get(obj, 'foo'), get(obj, 'computed'), 'runtime computed property updates if depency updates');

  assert.throws(() => {
    set(obj, 'computed', 'prohibited');
  }, /read-only/, 'runtime computed property cannot be overwritten by regular `set`');

  forceSet(obj, 'computed', readOnly('quux'));
  assert.equal(get(obj, 'quux'), get(obj, 'computed'), 'runtime computed property was correctly overwritten using `forceSet`');
});
