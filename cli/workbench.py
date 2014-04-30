import json


def loads(s):
    return json.loads(s)


def save(items, filename='inbox.txt'):
    """readably output for non-ascii user.
    Non-ascii strings in json are hexadecimal encoded and not human readable,
    so it print 'text' fields in UTF-8. Unfortunately JSON doesn't have comment notation,
    it is not JSON format.
    """
    fo = file(filename, 'w')
    for x in items:
        fo.write('# %s\n' % x['text'].encode('utf-8'))
        fo.write('%s\n' % json.dumps(x))
    fo.close()


def load(filename='inbox.txt'):
    """readably output for non-ascii user.
    see 'save' for why it needed.
    """
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
    return items


def list(items):
    for x in items:
        print x['id'], x['text']


def edit_text(id):
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

