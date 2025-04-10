Another year, another hackathon season! This time, I'm writing to narrate the
11th iteration of HackCU, CU&nbsp;Boulder's hackathon, which I attended with
[Megan](https://github.com/megankulshekar) and
[Renn](https://github.com/kylo33).

Leaving the Mines campus Friday morning with plenty of time to spare, we spent
some time brainstorming ideas and decided to do something with the
[Congress.gov&nbsp;API](https://api.congress.gov/). We wanted to make a
visualization for the data and provide an interface similar to Congress's
official website but with some simplifications to decrease its technical
barrier.

Search seemed like the best way to make the information accessible, so I set up
a simple fuzzy search with [Fuse.js](https://www.fusejs.io/). This worked fine
for searching members of Congress, but for searching bills, a much larger
dataset, it wasn't fast enough to execute every keypress.

Renn decided to download all available bills so that our search and
visualization functionalities could work locally on the server side. This
wasn't easy because bills were only available as XML files with inconsistent
formatting and fields, and they were also paginated, so only a few could be
downloaded at a time. Eventually, however, he wrote a Bash script that inserted
all 156,669 bills into a SQLite database, allowing us to implement an
exact-match search very easily with the
[`LIKE`](https://www.sqlite.org/optoverview.html#like_opt) SQL keyword. This
was quite performant.

Meanwhile, Megan, who'd recently covered machine learning in some of her
classes, wanted to apply this knowledge to our app, creating a model that
predicts the probability that a bill will pass by analyzing bills with similar
characteristics.

Although searching was functional, there was a lot of CSS to write to make the
search results look nice. I put the results in equal-width boxes, added
summaries underneath the titles, included dates, highlighted the portions of
the titles matching the search text, and more.

![a screenshot showing bill search results with titles highlighted to match the search query](search_screenshot.avif "The finished search page.")

Lots of these tasks came with small sub-problems. For example, since summaries
were not part of the locally available data, each bill incurred a network call
to fetch its summary—and the bills changed every time a key was pressed. This
made searching feel unresponsive. We solved this issue by making each result an
expandable card that didn't load the summary until the user clicked on it. This
was a good place to incorporate animation, which was delightfully easy thanks
to Svelte's [`transition:`](https://svelte.dev/docs/svelte/transition).

Highlighting matches presented another problem. At first, I wrapped every
occurrence of the search text in a `<span>` element with a yellow background
color using
[`String.prototype.replaceAll()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll).
Since I wanted search to be case-insensitive, I converted the titles to
lowercase before comparison, but this made all highlighted text become
lowercase, which looked awkward. After perusing the documentation awhile, I
learned that `replaceAll`'s replacement argument doesn't have to be a string.
It can be a function that receives the matched pattern (with case preserved) as
an argument and returns the desired `<span>...</span>` string.

Renn finished a [sankey plot](https://en.wikipedia.org/wiki/Sankey_diagram) of
the bills that showed them moving through the various stages of Congress. There
was a lot of that went into this, too, but the telling of that story is best
left to him. What it meant for me was refreshing the look and feel of the
homepage with the plot emphasized.

By this time, it was past midnight, so we took a break to continue the
tradition of visiting Insomnia Cookies every time we go to HackCU. Despite the
strange hour and distant location, [Tyler](https://tbwright.dev/) was happy to
join us for this. I got the same thing as last time—a scoop of vanilla ice
cream sandwiched between two cookies. Given how good it tasted, it must have
contained exactly the nutrients my body needed!

When this break ended, I reviewed my new design. It was my first foray into an
interface with a gradient, an element I've seen used sparingly but effectively
across a variety of modern website designs. Though of course there was room for
improvement, our UI looked quite nice for a hackathon project by the time we
were done. This was important because one of the project's main motivations was
overcoming the dated and technical UI offered by the first-party Congress
website.

![a screenshot showing a bill with information like the status, probability it passes, summary, and history](bill_screenshot.avif "The bill overview page, one of many we implemented.")

Seeing the "Action" timeline at the bottom reminds me of another little
adventure. Megan had added the timeline using a third-party timeline library.
It looked a lot better than what we had before, but it was designed for the
line to be vertically centered with text elements on alternating sides. It
wasn't too hard to make all the elements appear on the right side, but that
didn't remove the now-empty space on the left side, nor was there an option to
do so. Fishing around in the DOM inspector, I found that the undesirable `div`
had a class attribute `opposite-block`. Unfortunately, it was nested under
quite a few other elements. How could I add `display: none` to it? I did so by
writing a selector for all direct and non-direct child elements with that class
attribute. Turns out the Tailwind syntax for this is
`**:[&.opposite-block]:hidden`.

<small> (No, I did not use AI to figure this out. I read the documentation!
    (Whoa!) Which is a very good thing, since AI has been trained on the
    previous version of Tailwind, which has several incompatibilities with the
    recently released v4.) </small>

As we got closer to wrapping up, most of my commits were minor things like
[`text-wrap:
pretty`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap), showing
`<1%` instead of `0%` when the chance of a bill passing was between 0 and 1
percent, and all the other little details which cumulatively make a good
design. Megan and Renn both took a moment to sleep. I didn't, but given how
rapidly my productivity declined, I probably would've accomplished more in the
long run if I had.

I really enjoyed working with my teammates. Megan's ML model was an extremely
cool feature that added a lot of value to the project because besides the
visualization, it is the only functionality not implemented by Congress's
website. Even though it was his first hackathon, Renn did a lot of the heavy
lifting, writing most of the backend as well as designing our architecture and
processing a big dataset. Overall, the hackathon was a great way to spend a
weekend, and I hope to attend it again next year! Thanks very much to all the
organizers, volunteers, and sponsors who made it possible.

![a selfie with three students looking up from their laptops](teamphoto.avif "From left to right: Megan, me (Byron), and Renn.")
