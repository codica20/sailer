#! /bin/bash


export CHROME_PATH=$(find $HOME/.cache/puppeteer/chrome/ -name chrome | tail -n1 | sed  "s_${HOME}_/@{HOME}_")
cat | sudo tee /etc/apparmor.d/puppeteer-chrome <<EOF
abi <abi/4.0>,
include <tunables/global>

profile puppeteer-chrome $CHROME_PATH flags=(unconfined) {
  userns,

  # Site-specific additions and overrides. See local/README for details.
  include if exists <local/chrome>
}
EOF
sudo service apparmor reload  # reload AppArmor profiles to include the new one
