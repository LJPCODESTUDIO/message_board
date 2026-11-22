name: Tailscale Test
on:
  workflow_dispatch:
  push:
    branches:
      - 'main'
jobs:
  test-tailscale:
    runs-on: ubuntu-latest
    steps:
    - name: Connect to Tailnet
      uses: tailscale/github-action@v4
      with:
        oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
        oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
        tags: tag:gar
    - name: Test connectivity to server
      uses: tailscale/github-action@v4
      with:
        ping: ${{ secrets.SERVER_IP }}