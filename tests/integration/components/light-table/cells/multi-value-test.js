import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { set, setProperties } from '@ember/object';
import { run, schedule } from '@ember/runloop';
import { find } from 'ember-native-dom-helpers';
import Table from 'ember-light-table';

moduleForComponent('light-table/cells/multi-value', 'Integration | Component | light table/cells/multi value', {
  integration: true,

  beforeEach() {
    const column = Table.createColumn({
      valuePaths: ['foo', 'nested.properties.foo'],
      cellType: 'multi-value',
      cellClassNames: 'test-cell'
    });
    const row = Table.createRow({
      foo: 'bar',
      quux: 'quax',
      nested: {
        properties: {
          foo: 'nestedFoo',
          bar: 'nestedBar'
        }
      }
    });

    setProperties(this, {
      columns: [column],
      column,
      row
    });
  }
});

test('it renders in an `{{lt-row}}`', function(assert) {
  this.render(hbs`{{lt-row row columns}}`);
  assert.ok(find('.test-cell'));
});

test('it collects from arbitrarily deeply nested properties`', function(assert) {
  this.render(hbs`{{lt-row row columns}}`);
  assert.equal(find('.test-cell').textContent.trim(), 'bar,nestedFoo');
});

test('it reserves empty slots for unknown values`', function(assert) {
  set(this, 'column.valuePaths', ['foo', 'unknown', 'quux']);
  this.render(hbs`{{lt-row row columns}}`);
  assert.equal(find('.test-cell').textContent.trim(), 'bar,,quax');
});

test('it updates when arbitrarily deeply nested properties update`', function(assert) {
  this.render(hbs`{{lt-row row columns}}`);
  run(() => {
    set(this, 'row.nested.properties.foo', 'updatedNestedFoo');

    schedule('afterRender', () => {
      assert.equal(find('.test-cell').textContent.trim(), 'bar,updatedNestedFoo');
    });
  });
});

skip('it updates when the `valuePaths` update`', function(assert) {
  this.render(hbs`{{lt-row row columns}}`);
  run(() => {
    set(this, 'column.valuePaths', ['quux', 'nested.properties.bar']);

    schedule('afterRender', () => {
      assert.equal(find('.test-cell').textContent.trim(), 'quax,nestedBar');
    });
  });
});

test('it returns an unwrapped value when `valuePaths` is a singular path (not an array)`', function(assert) {
  set(this, 'column.valuePaths', 'foo');
  set(this, 'column.format', (value) => {
    assert.ok(typeof value === 'string', 'type is string');
    return value;
  });

  this.render(hbs`{{lt-row row columns}}`);
  assert.equal(find('.test-cell').textContent.trim(), 'bar', 'value is correct');
});

test('it returns an unwrapped value when `valuePath` is used instead of `valuePaths``', function(assert) {
  set(this, 'column.valuePaths', null);
  set(this, 'column.valuePath', 'foo');
  set(this, 'column.format', (value) => {
    assert.strictEqual(typeof value, 'string', 'type is string');
    return value;
  });

  this.render(hbs`{{lt-row row columns}}`);
  assert.equal(find('.test-cell').textContent.trim(), 'bar', 'value is correct');
});

test('it returns and empty array, if `valuePaths` is an empty array', function(assert) {
  set(this, 'column.valuePaths', []);
  set(this, 'column.format', (value) => {
    assert.ok(value instanceof Array, 'value is an array');
    assert.strictEqual(value.length, 0, 'value is an empty array');
    return value;
  });

  this.render(hbs`{{lt-row row columns}}`);
  assert.equal(find('.test-cell').textContent.trim(), '', 'value is empty');
});

test('it returns `null`, if neither `valuePaths` nor `valuePath` is set`', function(assert) {
  set(this, 'column.valuePaths', null);
  set(this, 'column.valuePath', null);
  set(this, 'column.format', (value) => {
    assert.strictEqual(value, null, 'value is null');
    return value;
  });

  this.render(hbs`{{lt-row row columns}}`);
  assert.equal(find('.test-cell').textContent.trim(), '', 'value is empty');
});
