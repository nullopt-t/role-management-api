/**
 * Base Repository Pattern
 * Provides common CRUD, pagination, filtering, and soft-delete operations
 * for all repositories to ensure consistency and reduce code duplication
 */

class BaseRepository {
	constructor(model) {
		this.model = model;
	}

	/**
	 * Find all records with optional filters and pagination
	 * @param {Object} options - Query options
	 * @param {Object} options.filters - MongoDB query filters
	 * @param {number} options.page - Page number (default: 1)
	 * @param {number} options.pageSize - Items per page (default: 10)
	 * @param {Object} options.sort - Sort options (default: { createdAt: -1 })
	 * @param {Array} options.populate - Population paths
	 * @param {boolean} options.lean - Return plain objects (default: true)
	 * @returns {Promise<Object>} Paginated results with metadata
	 */
	async findAll(options = {}) {
		const {
			filters = {},
			page = 1,
			pageSize = 10,
			sort = { createdAt: -1 },
			populate = [],
			lean = true,
		} = options;

		const skip = (page - 1) * pageSize;

		let query = this.model.find(filters);

		// Apply population
		if (populate.length > 0) {
			populate.forEach((popPath) => {
				if (typeof popPath === 'string') {
					query = query.populate(popPath);
				} else {
					query = query.populate(popPath);
				}
			});
		}

		// Apply sorting and pagination
		query = query.sort(sort).skip(skip).limit(pageSize);

		if (lean) {
			query = query.lean();
		}

		const [items, total] = await Promise.all([
			query,
			this.model.countDocuments(filters),
		]);

		return {
			items,
			page,
			pageSize,
			total,
			totalPages: Math.ceil(total / pageSize),
			hasNextPage: page < Math.ceil(total / pageSize),
			hasPrevPage: page > 1,
		};
	}

	/**
	 * Find a single record by ID
	 * @param {string} id - Record ID
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async findById(id, options = {}) {
		const { populate = [], lean = true } = options;

		let query = this.model.findById(id);

		if (populate.length > 0) {
			populate.forEach((popPath) => {
				query = query.populate(popPath);
			});
		}

		if (lean) {
			query = query.lean();
		}

		return query;
	}

	/**
	 * Find a single record by filter
	 * @param {Object} filter - MongoDB filter
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async findOne(filter, options = {}) {
		const { populate = [], lean = true } = options;

		let query = this.model.findOne(filter);

		if (populate.length > 0) {
			populate.forEach((popPath) => {
				query = query.populate(popPath);
			});
		}

		if (lean) {
			query = query.lean();
		}

		return query;
	}

	/**
	 * Create a new record
	 * @param {Object} data - Record data
	 * @returns {Promise<Object>}
	 */
	async create(data) {
		return this.model.create(data);
	}

	/**
	 * Update a record by ID
	 * @param {string} id - Record ID
	 * @param {Object} data - Update data
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async update(id, data, options = {}) {
		const { populate = [], lean = true } = options;
		const returnNew = options.new !== undefined ? options.new : true;

		let query = this.model.findByIdAndUpdate(id, data, { new: returnNew });

		if (populate.length > 0) {
			populate.forEach((popPath) => {
				query = query.populate(popPath);
			});
		}

		if (lean) {
			query = query.lean();
		}

		return query;
	}

	/**
	 * Delete a record permanently
	 * @param {string} id - Record ID
	 * @returns {Promise<Object|null>}
	 */
	async delete(id) {
		return this.model.findByIdAndDelete(id);
	}

	/**
	 * Soft delete a record (set isActive to false)
	 * @param {string} id - Record ID
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async softDelete(id, options = {}) {
		const { populate = [], lean = true } = options;

		let query = this.model.findByIdAndUpdate(
			id,
			{ isActive: false },
			{ new: true }
		);

		if (populate.length > 0) {
			populate.forEach((popPath) => {
				query = query.populate(popPath);
			});
		}

		if (lean) {
			query = query.lean();
		}

		return query;
	}

	/**
	 * Restore a soft-deleted record
	 * @param {string} id - Record ID
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async restore(id, options = {}) {
		const { populate = [], lean = true } = options;

		let query = this.model.findByIdAndUpdate(
			id,
			{ isActive: true },
			{ new: true }
		);

		if (populate.length > 0) {
			populate.forEach((popPath) => {
				query = query.populate(popPath);
			});
		}

		if (lean) {
			query = query.lean();
		}

		return query;
	}

	/**
	 * Check if a record exists
	 * @param {Object} filter - MongoDB filter
	 * @returns {Promise<boolean>}
	 */
	async exists(filter) {
		const result = await this.model.exists(filter);
		return !!result;
	}

	/**
	 * Count records matching filter
	 * @param {Object} filter - MongoDB filter
	 * @returns {Promise<number>}
	 */
	async count(filter = {}) {
		return this.model.countDocuments(filter);
	}

	/**
	 * Update multiple records matching filter
	 * @param {Object} filter - MongoDB filter
	 * @param {Object} data - Update data
	 * @returns {Promise<Object>} MongoDB update result
	 */
	async updateMany(filter, data) {
		return this.model.updateMany(filter, data);
	}

	/**
	 * Delete multiple records matching filter
	 * @param {Object} filter - MongoDB filter
	 * @returns {Promise<Object>} MongoDB delete result
	 */
	async deleteMany(filter) {
		return this.model.deleteMany(filter);
	}

	/**
	 * Soft delete multiple records matching filter
	 * @param {Object} filter - MongoDB filter
	 * @returns {Promise<Object>} MongoDB update result
	 */
	async softDeleteMany(filter) {
		return this.model.updateMany(filter, { isActive: false });
	}

	/**
	 * Get distinct values for a field
	 * @param {string} field - Field name
	 * @param {Object} filter - MongoDB filter
	 * @returns {Promise<Array>}
	 */
	async getDistinct(field, filter = {}) {
		return this.model.distinct(field, filter);
	}

	/**
	 * Perform aggregation pipeline
	 * @param {Array} pipeline - Aggregation pipeline stages
	 * @returns {Promise<Array>}
	 */
	async aggregate(pipeline) {
		return this.model.aggregate(pipeline);
	}
}

module.exports = BaseRepository;
