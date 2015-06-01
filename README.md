# loco-sass

loco-scss wrapper around node-sass

rename all class names and ids inside of @local rules to unique names

## Options

* file
  * input file (e.g. main.scss)
* <node-sass params>
  * any other node-sass param except: ``outFile``, ``sourceMap``, ``sourceMapEmbed`` and ``sourceMapContents``
* loco (object)
  * dest (object)
    * styles
      * path to the location where the final css file will be saved
    * scripts
      * folder where the js file structure will be created
  * format
    * format of the renamed class/id names
    * default: ``"%filepath%_%selector%_%sha1:10%"``
    * placeholders: ``%filepath%``, ``%filename%``, ``%selector%``, ``%sha1:x%``, ``%%base64:x%``
    * can also be a function that returns a string
      * as the only argument receives an object with filepath, filename, selector and rawFile
      * filename and filepath are already sanitized
      * filename, filepath and rawFile don't contain the file extension
  * plugins
    * array of postcss plugins that should be executed
    * default: ``[]``

## example

``node test``
