export default function isCacheLike(cache) {
	return !!(cache.set && cache.get && cache.del &&
		typeof cache.get === 'function' && typeof cache.set === 'function' && typeof cache.del === 'function');
}
