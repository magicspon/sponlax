# do stuff when shit's in the view

### Intersection Observer + requestAnimationFrame...

## Install

`npm install sponlax` or `yarn add sponlax`

```
import SponLax from 'sponlax'


<div data-motion data-spon-track>track on scroll when in view</div>
<div data-motion>Just onEnter and onLeave events triggered</div>

new SponLax('[data-motion]', {
    rootMargin: '0px',
    threshold: 0,
    shouldUnObserve: () => false,
    onEnter: ($node) => {},
    onLeave: ($node) => {},
    inview($node) {
        const { top } = $node.getBoundingClientRect()
        const { speed } = $node.dataset
        $node.style.transform = `translate3d(0, ${top * parseFloat(speed)}px, 0)`
    },
})
```
