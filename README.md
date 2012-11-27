![Banshee](https://raw.github.com/imulus/banshee/gh-pages/images/banshee-horizontal-lockup.png)

##A speedy tool for combining and compressing your JavaScript, CoffeeScript, CSS and LESS source files.

Banshee combines your source files into a single script or stylesheet to reduce HTTP overhead and make development easier. It has built-in support for <a href="https://github.com/sstephenson/sprockets">Sprockets-style</a> dependency syntax (`#= require x`) and a lightning-fast, built-in watch mechanism to detect changes to your source files and recompile on the fly.

Requires node v0.8+

[![Build Status](https://secure.travis-ci.org/imulus/banshee.png)](http://travis-ci.org/imulus/banshee)


###Installation

```bash
$ npm install -g banshee
```

###Command Line Interface

**Syntax:**

```bash
$ banshee <input file>:<output file> [options]
```

**Example**

```bash
$ banshee src/application.coffee:build/application.min.js
```


###Options

<table>
	<thead>
		<th>Option</th>
		<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<th>-c, --compress</th>
			<td>Compress the final output</td>
		</tr>
		<tr>
			<th>-w, --watch</th>
			<td>Use the built-in watch mechanism to observe your source files and re-compile when something changes</td>
		</tr>
		<tr>
			<th>-q, --quiet</th>
			<td>Quiet the command-line output</td>
		</tr>
		<tr>
			<th>--no-color</th>
			<td>Disable color in the output</td>
		</tr>
		<tr>
			<th>--full-paths</th>
			<td>Use full filepaths in the manifest output</td>
		</tr>
		<tr>
			<th>--clear</th>
			<td>Clear the terminal window, on by default with --watch</td>
		</tr>
		<tr>
			<th>-h, --help</th>
			<td>Output usage information</td>
		</tr>
		<tr>
			<th>-v, --version</th>
			<td>Output the version number</td>
		</tr>
	</tbody>
</table>


###Requiring Source Files

Banshee supports [Sprockets-style](https://github.com/sstephenson/sprockets) requires, with one exception. Instead of using `require_tree`, you can simply use `require` and Banshee will automatically detect if the path is a source file or a directory.


**Syntax:** (JavaScript)

```javascript
//= require lib/some_directory
//= require other_file.js
```

**Syntax:** (CoffeeScript)

```coffee
#= require lib/some_directory
#= require other_file.coffee
```

**Syntax:** (CSS)
```css
/*= require lib/some_directory */
/*= require other_file.css */
```

**Syntax:** (LESS) Uses normal LESS import statements.
```css
@import 'lib/dependency1';
@import 'dependency2';
```

Paths used in `require` statements are evaluated relative to the file which contains them.


###Contribute
**We'd love your help. Fork us so we can make Banshee better.**

```bash
$ git clone git://github.com/imulus/banshee
```

###Download

You can download this project in either
[zip](http://github.com/imulus/banshee/zipball/master) or [tar](http://github.com/imulus/banshee/tarball/master) formats.

or get the source code on GitHub : [imulus/banshee](http://github.com/imulus/banshee)





