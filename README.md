# do stuff when shit's in the view

### Intersection Observer + requestAnimationFrame...

## Install

`npm install sponlax` or `yarn add sponlax`

## Usage example

Demo: http://sponlax.surge.sh/

```
import 'SponLax' from 'sponlax'

new SponLax('[data-item]', {
    inview({ $node }) {
        const { top } = $node.getBoundingClientRect()
        const { speed } = $node.dataset
        $node.style.transform = `translate3d(0, ${top * parseFloat(speed)}px, 0)`
    }
})
```
