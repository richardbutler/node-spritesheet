
[![Build Status](https://secure.travis-ci.org/kriskowal/q-fs.png)](http://travis-ci.org/kriskowal/q-fs)

File system API for Q when/defer-style promises

Open options:

-   ``flags``: ``r``, ``w``, ``a``, ``b``
-   ``charset``: default of ``utf-8``
-   ``bufferSize``: in bytes
-   ``mode``: UNIX permissions
-   ``begin`` first byte to read (defaults to zero)
-   ``end`` one past the last byte to read.  ``end - begin == length``

Functions:

-   ``open(path, options)``
-   ``read(path, options)``
-   ``write(path, content, options)``
-   ``append(path, content, options)`` NOT TESTED
-   ``copy(source, target)`` NOT IMPLEMENTED
-   ``list(path)``
-   ``listTree(path, guard_opt(path, stat)``)
-   ``listDirectoryTree(path)``
-   ``glob(pattern)`` NOT IMPLEMENTED
-   ``match(pattern, file)`` NOT IMPLEMENTED
-   ``makeDirectory(path)``
-   ``makeTree(path)`` NOT TESTED
-   ``remove(path)`` NOT TESTED
-   ``removeTree(path)`` NOT TESTED
-   ``link(source, taget)`` NOT TESTED (probably safe)
-   ``chown(path, uid, gid)`` NOT TESTED (probably safe)
-   ``chmod(path, mode)`` NOT TESTED (probably safe)
-   ``stat(path)``
-   ``statLink(path)`` NOT TESTED
-   ``statFd(fd)`` NOT TESTED
-   ``exists(path)``
-   ``isFile(path)``
-   ``isDirectory(path)``
-   ``lastModified(path)``
-   ``split(path)``
-   ``join(paths)``
-   ``join(...paths)``
-   ``resolve(...paths)``
-   ``normal(...paths)``
-   ``absolute(path)``
-   ``canonical(path)``
-   ``readLink(path)``
-   ``contains(parent, child)``
-   ``relative(source, target)``
-   ``relativeFromFile(source, target)``
-   ``relativeFromDirectory(source, target)``
-   ``isAbsolute(path)``
-   ``isRelative(path)``
-   ``isRoot(path)``
-   ``root(path)``
-   ``directory(path)``
-   ``base(path, extension)``
-   ``extension(path)``
-   ``reroot(path_opt)``
-   ``toObject(path_opt)``

Copyright 2009, 2010 Kristopher Michael Kowal
MIT License (enclosed)

