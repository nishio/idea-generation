"""
command line interface

Usage
1: Run IPython
2: execfile('workbench.py')

"""

import json
default_items = []

def import_json(s):
    global default_items
    default_items = json.loads(s)
    return default_items


def export_json(items=None):
    if not items: items = default_items
    print json.dumps(items)


def export_json_to_clipboard(items=None):
    if not items: items = default_items
    s = json.dumps(items)
    _to_clipboard(s)


def _to_clipboard(s):
    'Mac only'
    from AppKit import NSPasteboard, NSArray
    pb = NSPasteboard.generalPasteboard()
    pb.clearContents()
    a = NSArray.arrayWithObject_(s)
    pb.writeObjects_(a)


def save(items=None, filename='inbox.txt'):
    """readably output for non-ascii user.
    Non-ascii strings in json are hexadecimal encoded and not human readable,
    so it print 'text' fields in UTF-8. Unfortunately JSON doesn't have comment notation,
    it is not JSON format.
    """
    if not items: items = default_items
    fo = file(filename, 'w')
    for x in items:
        fo.write('# %s\n' % x['text'].encode('utf-8'))
        fo.write('%s\n' % json.dumps(x))
    fo.close()


def load(filename='inbox.txt'):
    """readably output for non-ascii user.
    see 'save' for why it needed.
    """
    global default_items
    f = file(filename)
    items = []
    prev_text = None
    for line in f:
        if line.startswith('#'):
            prev_text = line[2:].strip('\n').decode('utf-8')
            continue
        item = json.loads(line)
        if prev_text and item['text'] != prev_text:
            print 'overwrite text', item['id'], 'before:', item['text'], 'after:', prev_text
            item['text'] = prev_text
            prev_text = None
        items.append(item)
    f.close()
    default_items = items
    return items


def list(items=None):
    if not items: items = default_items
    for x in items:
        print x['id'], x['text']


def edit_text(items=None, id=None):
    if not items: items = default_items
    if id == None: raise RuntimeError('id required')
    max_id = 0
    target = None
    for x in items:
        xid = int(x['id'])
        if xid > max_id: max_id = xid
        if xid == id:
            print x['id'], x['text']
            target = x

    t = raw_input('new text(abort on empty)>>')
    if not t:
        print 'no text, abort'
        return  # abort
    target['text'] = t
    print 'modified'
    print target['id'], target['text']

