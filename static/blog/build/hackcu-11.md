**TODO:** Ask Renn if he wants me to link to his GitHub  
**TODO:** Ask for permissions using the pictures and incorporate them.

This time, the teammates with whom I collaborated were
[Megan](https://github.com/megankulshekar) and
[Renn](https://github.com/kylo33). We left for CU with plenty of time to spare
Friday morning. When we arrived, we had some time to brainstorm ideas and
decided to do something with the
[Congress.gov&nbsp;API](https://api.congress.gov/). We knew we wanted to make a
cool visualization for the data accessible through this API and generally make
the data more accessible than Congress's website does, but otherwise, our goal
wasn't very clearly defined.

In the beginning, I toyed around with different things one might do with the
data, like searching through members of Congress or showcasing a list of recent
bills. Knowing npm, I figured there would be plenty of fuzzy search JavaScript
libraries, and I was right. After we decided to move the search functionality
to searching bills instead of members, I realized that fuzzy search wouldn't be
fast enough to update every keypress any more.

In the spirit of a true data collector, Renn decided to download all available
bills locally for us to search them quickly. This was pretty difficult, as they
were only available through paginated XML files with inconsistent formatting
and fields. Eventually, however, he wrote a Bash script that inserted all
156,669 bills into a SQLite database, allowing us to implement a crude search
very easily with the `LIKE` SQL keyword. This was quite performant.

Megan, meanwhile, had been learning some pretty cool machine learning stuff in
classes and wanted to apply it to this app by creating a model that predicted
the likelihood of a bill passing by analyzing bills with similar
characteristics.

There was a lot of polishing to do on the search results, mostly when it came
to CSS. I put them in nice boxes, added summaries underneath the title,
included a date, highlighted the portion of the title that matched the search
result, and more.

Lots of these tasks came with small sub-problems. Adding summaries was too slow
because each summary involved an API call that (if my memory serves me
correctly) was not available through our downloaded data, so it cost many
network calls on each keypress. We solved this issue by making each result an
expandable card that didn't load the summary until the user clicked on it. This
was a good place to make an animation, which was delightfully easy with
Svelte's [`transition:`](https://svelte.dev/docs/svelte/transition) template.

At first, I highlighted search matches by finding matching substrings and
wrapping them in `<span>` elements. Since I wanted search to be
case-insensitive, I had to convert the titles to lowercase before finding
substrings, but of course, this made all the highlighted text lowercase, which
looked really bad. To avoid modifying the original string, I wrote a regular
expression to retain case-insensitive search capabilities. However, I couldn't
figure out how to recover the matched pattern when using
[`String.prototype.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace).
I finally discovered that when the second argument is a function instead of a
string, that function can take an argument which is the matched pattern. Phew!

Renn finished a [sankey plot](https://en.wikipedia.org/wiki/Sankey_diagram) of
the bills that showed them moving through the various houses and progress
points of Congress. There was a lot of that went into this, too, but the
telling of that story is best left to him. What it meant for me was refreshing
the look and feel of the homepage with the diagram emphasized.

Somewhere in here, we took a break to continue a tradition where we visit
Insomnia Cookies every time we go to HackCU. Despite the strange hour and
distant location, [Tyler](https://tbwright.dev/) was happy to join us for this.
I got the same thing as last time—a scoop of vanilla ice cream sandwiched
between two cookies. How healthy!

The new design was my first foray into an interface with a gradient, an element
I've seen used sparingly but effectively across a variety of modern website
designs. Overall, I think our UI looked quite nice for a hackathon project by
the time we were done. This was important because one of the project's main
motivations was overcoming the dated and technical UI offered by the
first-party Congress website.

![a screenshot showing a bill with information like the status, probability it
passes, summary, and history](bill_screenshot.avif)

Seeing the "Action" timeline at the bottom reminds me of another little
problem. Megan had added the timeline using a third-party timeline library. It
looked a lot better than what we had before, but it was designed for the line
to be vertically centered with elements on alternating sides. It wasn't too
hard to make all the elements appear on the right side, but that didn't remove
the now-empty space on the left side, nor was there an option to remove it.
Fishing around in the DOM, I found that the undesirable `div` had a class
attribute `opposite-block`. Unfortunately, it was nested under quite a few
other elements. How could I add `display: none` to it? I did so by writing a
selector for all child elements of the list with that class attribute. Turns
out the Tailwind syntax for this is `**:[&.opposite-block]:hidden`.

As we got closer to wrapping up, most of the commits were minor things like
[`text-wrap:
pretty`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap), showing
`<1%` instead of `0%` when the chance of a bill passing was between 0 and 1
percent, and all the other little details which together make a good design.
Megan and Renn both took a moment to sleep. I didn't, but given how rapidly my
productivity declined, I probably would've accomplished more in the long run if
I had!

I really enjoyed working with my teammates. Megan's ML model was an extremely
cool thing that I think added a lot of value to the project, as besides the
visualization it is the only part of the project that isn't (to my knowledge)
implemented by Congress's website. Though it was his first hackathon, Renn did
great, writing most of the backend as well as designing most of our
architecture and processing a big dataset. Overall, the hackathon was a great
way to spend a weekend, and I'm excited to attend it again next year! Thanks
very much to all the organizers, volunteers, and sponsors for making it
possible.
