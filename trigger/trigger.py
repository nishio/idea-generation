# -*- coding: utf-8 -*-
"""
read ../localserver/data, choice randomly and send it as email
"""
import smtplib
from email.MIMEText import MIMEText
from email.Header import Header
from email.Utils import formatdate

import sys
import os

import json
from random import choice

def create_message(from_addr, to_addr, subject, body, encoding='utf-8'):
    msg = MIMEText(body, 'plain', encoding)
    msg['Subject'] = Header(subject, encoding)
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Date'] = formatdate()
    return msg


def send_via_gmail(from_address, to_address, msg, address, password):
    # send via gmail
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.ehlo()
    s.starttls()
    s.ehlo()
    s.login(from_address, password)
    s.sendmail(from_address, [to_address], msg.as_string())
    s.close()

def main():
    import secret
    from_address = secret.from_address
    password = secret.password
    to_address = secret.to_address

    items = []
    PATH = '../localserver/data'
    for filename in os.listdir(PATH):
        if filename.startswith('test'): continue
        newitems = json.load(file(os.path.join(PATH, filename)))
        items.extend(newitems)

    item = choice(items)
    print item

    subject = item['text']
    body = item['text']
    body += '\n\n'
    body += item.get('title', '')
    if item.has_key('pages'):
        body += ' p. ' + item['pages']
    body += '\n'
    body += item.get('author', '')

    if 0:
        print body
    else:
        msg = create_message(to_address, to_address, subject, body, 'utf-8')
        send_via_gmail(from_address, to_address, msg, from_address, password)

if __name__ == '__main__':
    main()
