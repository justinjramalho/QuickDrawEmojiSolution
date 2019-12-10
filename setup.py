# -*- coding: utf-8 -*-
from distutils.core import setup

packages = \
['app']

package_data = \
{'': ['*'], 'app': ['static/*', 'templates/*']}

install_requires = \
['flask==1.0.2', 'sklearn==0.0']

setup_kwargs = {
    'name': 'app',
    'version': '0.0.0',
    'description': '',
    'long_description': None,
    'author': 'Your Name',
    'author_email': 'you@example.com',
    'url': None,
    'packages': packages,
    'package_data': package_data,
    'install_requires': install_requires,
    'python_requires': '>=3.7,<4.0',
}


setup(**setup_kwargs)
