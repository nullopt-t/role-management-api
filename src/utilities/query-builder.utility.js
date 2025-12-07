/**
 * Query Builder Utility
 * Constructs MongoDB queries with filters, sorting, and pagination
 * for consistent and maintainable query patterns
 */

class QueryBuilder {
	constructor() {
		this.filters = {};
		this.sort = { createdAt: -1 };
		this.page = 1;
		this.pageSize = 10;
		this.populate = [];
		this.lean = true;
	}

	/**
	 * Add filters to the query
	 * @param {Object} filters - MongoDB filters to merge
	 * @returns {QueryBuilder} - for chaining
	 */
	addFilters(filters) {
		this.filters = { ...this.filters, ...filters };
		return this;
	}

	/**
	 * Set a specific filter value
	 * @param {string} key - Filter key
	 * @param {*} value - Filter value
	 * @returns {QueryBuilder} - for chaining
	 */
	addFilter(key, value) {
		this.filters[key] = value;
		return this;
	}

	/**
	 * Add conditional filter (only if value is truthy)
	 * @param {string} key - Filter key
	 * @param {*} value - Filter value
	 * @returns {QueryBuilder} - for chaining
	 */
	addConditionalFilter(key, value) {
		if (value !== null && value !== undefined && value !== '') {
			this.filters[key] = value;
		}
		return this;
	}

	/**
	 * Add regex search filter on multiple fields
	 * @param {Array<string>} fields - Field names to search
	 * @param {string} searchTerm - Search term
	 * @param {string} options - Regex options (default: 'i' for case-insensitive)
	 * @returns {QueryBuilder} - for chaining
	 */
	addSearch(fields, searchTerm, options = 'i') {
		if (!searchTerm) {
			return this;
		}
		this.filters.$or = fields.map((field) => ({
			[field]: { $regex: searchTerm, $options: options },
		}));
		return this;
	}

	/**
	 * Set sorting
	 * @param {Object} sortObj - Sort object { field: 1 or -1 }
	 * @returns {QueryBuilder} - for chaining
	 */
	setSort(sortObj) {
		this.sort = sortObj;
		return this;
	}

	/**
	 * Add sort field
	 * @param {string} field - Field name
	 * @param {number} direction - 1 for ascending, -1 for descending (default: -1)
	 * @returns {QueryBuilder} - for chaining
	 */
	addSort(field, direction = -1) {
		this.sort[field] = direction;
		return this;
	}

	/**
	 * Set pagination
	 * @param {number} page - Page number (default: 1)
	 * @param {number} pageSize - Items per page (default: 10)
	 * @returns {QueryBuilder} - for chaining
	 */
	setPagination(page = 1, pageSize = 10) {
		this.page = Math.max(1, page);
		this.pageSize = Math.max(1, Math.min(pageSize, 100)); // Max 100 per page
		return this;
	}

	/**
	 * Set population paths
	 * @param {Array<string|Object>} paths - Population paths
	 * @returns {QueryBuilder} - for chaining
	 */
	setPopulate(paths) {
		this.populate = Array.isArray(paths) ? paths : [paths];
		return this;
	}

	/**
	 * Add population path
	 * @param {string|Object} path - Population path
	 * @returns {QueryBuilder} - for chaining
	 */
	addPopulate(path) {
		this.populate.push(path);
		return this;
	}

	/**
	 * Set lean option (return plain objects)
	 * @param {boolean} lean - Lean option
	 * @returns {QueryBuilder} - for chaining
	 */
	setLean(lean = true) {
		this.lean = lean;
		return this;
	}

	/**
	 * Add active records only filter
	 * @returns {QueryBuilder} - for chaining
	 */
	onlyActive() {
		this.filters.isActive = true;
		return this;
	}

	/**
	 * Add inactive records only filter
	 * @returns {QueryBuilder} - for chaining
	 */
	onlyInactive() {
		this.filters.isActive = false;
		return this;
	}

	/**
	 * Clear isActive filter to get all records
	 * @returns {QueryBuilder} - for chaining
	 */
	clearActiveFilter() {
		delete this.filters.isActive;
		return this;
	}

	/**
	 * Get the current query configuration
	 * @returns {Object} Query config object
	 */
	build() {
		return {
			filters: this.filters,
			page: this.page,
			pageSize: this.pageSize,
			sort: this.sort,
			populate: this.populate,
			lean: this.lean,
		};
	}

	/**
	 * Reset the builder to defaults
	 * @returns {QueryBuilder} - for chaining
	 */
	reset() {
		this.filters = {};
		this.sort = { createdAt: -1 };
		this.page = 1;
		this.pageSize = 10;
		this.populate = [];
		this.lean = true;
		return this;
	}
}

module.exports = QueryBuilder;
