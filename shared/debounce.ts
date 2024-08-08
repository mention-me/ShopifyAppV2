interface DebounceOptions {
	shouldRunImmediately?: boolean;
}

/**
 * Options for the debounce function
 */
const defaultOptions: DebounceOptions = {
	// Immediately invoke the provided function then timeout (essentially, single throttle).
	shouldRunImmediately: false,
};

type Cancellable<T> = T & { cancel: () => void };

/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * If `shouldRunImmediately` is passed, trigger the function on the leading edge, instead of the trailing.
 *
 * @param {Function} callback Function to invoke
 * @param {Number} duration Milliseconds to wait before/after invoking the function
 * @param {object} options A series of options for the debounce function (see above)
 *
 * @returns {Function} A debounce version of the function provided function
 */
const debounce = <T extends (...args: any) => void>(
	callback: T,
	duration: number,
	options: DebounceOptions = {}
): Cancellable<T> => {
	const newOptions = {
		...defaultOptions,
		...options,
	};

	let timeout: ReturnType<typeof setTimeout> | null;

	const ret = ((...args: any) => {
		const later = () => {
			timeout = null;

			if (!newOptions.shouldRunImmediately) {
				callback(...args);
			}
		};

		const shouldCallNow = newOptions.shouldRunImmediately && !timeout;

		if (timeout !== null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(later, duration);

		if (shouldCallNow) {
			callback(...args);
		}
	}) as Cancellable<T>;

	ret.cancel = () => {
		if (timeout) {
			clearTimeout(timeout);
		}
	}

	return ret;
};

export default debounce;
