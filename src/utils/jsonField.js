/**
 * Sequelize's DataTypes.JSON is only auto-parsed back into a real JS
 * array/object when the database has genuine native JSON column support
 * (MySQL 5.7.8+). On MariaDB, `JSON` is just an alias for `LONGTEXT`, so
 * the driver hands back the raw JSON-encoded string instead - and without
 * this, code like `destination.famousFor.map(...)` throws because
 * `famousFor` is a string, not an array.
 *
 * This getter normalizes both cases: if the stored value already comes
 * back parsed (real MySQL), it's passed through untouched; if it comes
 * back as a string (MariaDB), it's JSON.parse'd. Works on either database
 * with no schema or data changes needed.
 *
 * Usage on a model field:
 *   images: {
 *     type: DataTypes.JSON,
 *     allowNull: true,
 *     defaultValue: [],
 *     get: jsonGetter('images', []),
 *   }
 */
function jsonGetter(field, fallback) {
  return function () {
    const raw = this.getDataValue(field);
    if (raw === null || raw === undefined) return fallback;
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch (err) {
        return fallback;
      }
    }
    return raw;
  };
}

module.exports = { jsonGetter };
