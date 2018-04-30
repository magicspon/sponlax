/* credit: https://github.com/wuct/raf-throttle */

const throttle = callback => {
	let requestId

	const later = (context, args) => () => {
		requestId = null
		callback.apply(context, args)
	}

	const throttled = function(...args) {
		if (requestId === null || requestId === undefined) {
			requestId = requestAnimationFrame(later(this, args))
		}
	}

	throttled.cancel = () => cancelAnimationFrame(requestId)

	return throttled
}

export default class SponLax {
	defaults = {
		rootMargin: '0px',
		threshold: 0,
		shouldUnObserve: () => false,
		onEnter: () => {},
		onLeave: () => {},
		inview: () => {}
	}

	constructor(selector = '[data-inview]', options = {}) {
		this.update(selector, options)
	}

	update = (selector = '[data-inview]', options = {}) => {
		this.options = { ...this.defaults, ...options }
		const nodes =
			typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector

		const { rootMargin, threshold } = this.options

		this.observer = new IntersectionObserver(this.onIntersection(), {
			rootMargin,
			threshold
		})

		this.nodes = [...nodes].map(($node, index) => {
			$node.setAttribute('data-sponlax-key', index)
			this.observer.observe($node)
			return $node
		})

		this.elements = {}
	}

	prevFrame = -1

	within = node => node.getAttribute('data-inview') === 'true'

	disconnect = () => {
		if (this.observer) {
			this.observer.disconnect()
			this.throttled && this.throttled.cancel()
		}
	}

	isRunning = false

	loop = () => {
		const { pageYOffset } = window

		if (pageYOffset === this.prevFrame) {
			this.throttled()
			return
		}

		this.isRunning = true

		const direction = this.prevFrame > pageYOffset ? 'up' : 'down'

		this.prevFrame = pageYOffset

		const { inview } = this.options

		Object.entries(this.elements).forEach(([, node]) => {
			inview(node, direction, pageYOffset)
		})

		this.throttled()
	}

	intersectNode = entry => {
		const { shouldUnObserve, onEnter, onLeave } = this.options
		const { target: $node, isIntersecting } = entry

		const key = $node.getAttribute('data-spon-key')
		const track = $node.hasAttribute('data-spon-track')
		
		$node._props = entry

		if (isIntersecting) {
			if (shouldUnObserve($node)) {
				this.observer.unobserve($node)
			}

			if (track) {
				this.elements[key] = $node
			}

			onEnter($node)

			!this.within($node) && $node.setAttribute('data-inview', 'true')
		} else {
			this.within($node) && $node.setAttribute('data-inview', 'false')
			onLeave($node)

			if (track) {
				delete this.elements[key]
			}
		}
	}

	onIntersection = () => entries => {
		entries.forEach(this.intersectNode)

		if (this.isRunning === false) {
			const keys = Object.keys(this.elements).length

			if (keys > 0) {
				this.throttled = this.throttled || throttle(this.loop)
				this.throttled()
				this.isRunning = true
			} else if (this.throttled) {
				this.throttled.cancel()
				this.throttled = null
				this.isRunning = false
			}
		}
	}
}
