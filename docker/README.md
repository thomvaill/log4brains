# Log4brains

Official Docker image of the Log4brains CLI: <https://github.com/thomvaill/log4brains>

## Usage

```bash
docker run --rm -ti -v $(pwd):/workdir -p 4004:4004 thomvaill/log4brains help
```

Note: the browser auto-open feature is not available when running from Docker.
