# Makedockfile
# https://github.com/Thomvaill/Makedockfile/
#
# @version 1.1.0
# @author  Thomvaill (https://github.com/Thomvaill)
# @license MIT
#
# Inspired by https://gist.github.com/mpneuried/0594963ad38e68917ef189b4e6a269db
#

MDF_MAKEDOCKFILE_VERSION = 1.1.0
MDF_MAKEDOCKFILE_REPOSITORY = https://github.com/Thomvaill/Makedockfile.git

# CONFIG
# The following environment variables MUST be set in Makedockfile.conf:
# - MDF_REPOSITORY   : the Docker repository name, ie the image name
#
# The following environment variables SHOULD be set/overriden in Makedockfile.conf, Makedockfile.dist.conf or by an environment variable:
# - MDF_REGISTRY     : the Docker registry hostname. Useful for private registries. Default: blank
# - MDF_NAMESPACE    : the Docker namespace name: on Docker Hub it's your username. It can be anything on a private one, or blank. Default: blank
# - MDF_BRANCH_TAG   : the identifier used to generate the "branch-tag". The result of `git branch` is the default value
# - MDF_VERSION_TAG  : the identifier used to generate the "version-tag". Disabled by default
# - MDF_UTAG         : a unique identifier used to tag the current image. Something containing the current commit hash is a good choice!
#                      Default value: MDF_VERSION_TAG-COMMIT_HASH if MDF_VERSION_TAG is defined,
#                                     just COMMIT_HASH if not
#                      You can execute `make print-utag` to see the result
#
# - MDF_BUILD_PARAMS : additional parameters to pass to docker build. Some useful ones: --no-cache, --squash...
# - MDF_RUN_PARAMS   : additional parameters to pass to docker run. Some useful ones: -p, -v...
# - MDF_RUN_CMD      : to override the default image command
# - MDF_TEST_PARAMS  : additional parameters to pass to docker run in test mode. Especially used for volumes, to bind-mount test results
#

# Include Makedockfile[.dist].conf
-include Makedockfile.dist.conf
include Makedockfile.conf

# Default values for optional variables
ifdef MDF_VERSION_TAG
MDF_UTAG ?= $(MDF_VERSION_TAG)-$(shell git log -1 --pretty=%h)
else
MDF_UTAG ?= $(shell git log -1 --pretty=%h)
endif
MDF_BRANCH_TAG ?= $(shell git rev-parse --abbrev-ref HEAD | tr / -)

# Private variables
ifdef MDF_NAMESPACE
MDF_IMAGE_NAME = $(MDF_NAMESPACE)/$(MDF_REPOSITORY)
MDF_CONTAINER_NAME = $(MDF_NAMESPACE)_$(MDF_REPOSITORY)
else
MDF_IMAGE_NAME = $(MDF_REPOSITORY)
MDF_CONTAINER_NAME = $(MDF_REPOSITORY)
endif

ifdef MDF_REGISTRY
MDF_REGISTRY_IMAGE_NAME = $(MDF_REGISTRY)/$(MDF_IMAGE_NAME)
else
MDF_REGISTRY_IMAGE_NAME = $(MDF_IMAGE_NAME)
endif

MDF_ARTIFACT_PATH = ./Makedockfile.out


check_defined = \
    $(strip $(foreach 1,$1, \
        $(call __check_defined,$1,$(strip $(value 2)))))
__check_defined = \
    $(if $(value $1),, \
        $(error Undefined $1$(if $2, ($2))$(if $(value @), \
                required by target `$@')))




#:## Help
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help
	@awk 'BEGIN { \
		print "Makedockfile v$(MDF_MAKEDOCKFILE_VERSION)\n\
	Usage: make \033[36mCOMMAND\033[0m\n\n\
	Have a look at Makedockfile.conf and Makefile for configuration help\n\
	You can override configuration in Makedockfile.dist.conf or by passing environment variables directly ";\
	\
		FS = ":.*?## "} \
	/^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2} \
	/^#:## / {printf "\n\033[35m%s\033[0m\n", $$2} ' \
	$(MAKEFILE_LIST)

.DEFAULT_GOAL := help





#:## Docker tasks for development
build: ## Build image
	$(eval MDF_IIDFILE_PATH := $(shell mktemp -t dm-iid-XXXXXX))
	@echo 'Building $(MDF_IMAGE_NAME)...'
	docker image build --force-rm=true --iidfile=$(MDF_IIDFILE_PATH) $(MDF_BUILD_PARAMS) -t $(MDF_IMAGE_NAME):latest .
	@echo "MDF_IMAGE_ID=`cat $(MDF_IIDFILE_PATH)`" > $(MDF_ARTIFACT_PATH)
	@rm -f $(MDF_IIDFILE_PATH)

run: stop rm ## Run container
	@echo 'Running $(MDF_CONTAINER_NAME)...'
	docker container run -it -d --name="$(MDF_CONTAINER_NAME)" $(MDF_RUN_PARAMS) $(MDF_IMAGE_NAME):latest $(MDF_RUN_CMD)
	@echo '$(MDF_CONTAINER_NAME) now runs in detached mode'

up: build run ## Build image and run container

stop: ## Stop running container
	@echo 'Stopping $(MDF_CONTAINER_NAME)...'
	@[ "$$(docker container ls | grep ' $(MDF_CONTAINER_NAME)$$')" ] && docker container stop $(MDF_CONTAINER_NAME) || exit 0

kill: ## Kill running container
	@echo 'Killing $(MDF_CONTAINER_NAME)...'
	@[ "$$(docker container ls | grep ' $(MDF_CONTAINER_NAME)$$')" ] && docker container kill $(MDF_CONTAINER_NAME) || exit 0

rm: ## Remove the container
	@echo 'Removing $(MDF_CONTAINER_NAME)...'
	@[ "$$(docker container ls -a | grep '$(MDF_CONTAINER_NAME)$$')" ] && docker container rm $(MDF_CONTAINER_NAME) || exit 0

attach: ## Attach to running container
	docker container attach $(MDF_CONTAINER_NAME)

diff: ## Inspect changes to files or directories on the running container
	docker container diff $(MDF_CONTAINER_NAME)

bash: ## Start an interactive bash terminal in the running container
	docker container exec -it $(MDF_CONTAINER_NAME) /bin/bash

sh: ## Start an interactive sh terminal in the running container
	docker container exec -it $(MDF_CONTAINER_NAME) /bin/sh

pause: ## Pause the running container
	docker container pause $(MDF_CONTAINER_NAME)

unpause: ## Unpause the paused container
	docker container unpause $(MDF_CONTAINER_NAME)

restart: ## Restart the running container
	docker container restart $(MDF_CONTAINER_NAME)

top: ## Display the running processes of the running container
	docker container top $(MDF_CONTAINER_NAME)

logs: ## Fetch the logs of the running container
	docker container logs $(MDF_CONTAINER_NAME)

logs-follow: ## Follow running container logs
	docker container logs --follow $(MDF_CONTAINER_NAME)

test: build ## Build image and run unit tests (Dockerfile.test needed)
	@echo 'Building test image...'
	docker image build --force-rm=true -t $(MDF_IMAGE_NAME):test --file Dockerfile.test .
	@echo 'Running test image...'
	docker container run $(MDF_TEST_PARAMS) --rm $(MDF_IMAGE_NAME):test



#:## Docker tasks for CI/CD
define tag_and_push # from, to
	docker image tag $(1) $(2)
	docker image push $(2)
endef

define append_artifact_file # variable_name, variable_value
	@echo "$(1)=$(2)" >> $(MDF_ARTIFACT_PATH)
endef

release: build ## Build image, tag it with a unique identifier and push it to the repository
	@echo 'Releasing under the tag "$(MDF_UTAG)"...'
	$(call reset_artifact_file)
	$(call tag_and_push,$(MDF_IMAGE_NAME):latest,$(MDF_REGISTRY_IMAGE_NAME):$(MDF_UTAG))
	$(call append_artifact_file,MDF_REGISTRY_IMAGE_NAME,$(MDF_REGISTRY_IMAGE_NAME))
	$(call append_artifact_file,MDF_UTAG,$(MDF_UTAG))

branch-tag: release ## Add this target to `release` to also tag the released image with the current Git branch name
	@echo 'Tagging the current release as "$(MDF_BRANCH_TAG)"...'
	$(call tag_and_push,$(MDF_REGISTRY_IMAGE_NAME):$(MDF_UTAG),$(MDF_REGISTRY_IMAGE_NAME):$(MDF_BRANCH_TAG))
	$(call append_artifact_file,MDF_BRANCH_TAG,$(MDF_BRANCH_TAG))
	@echo 'Tagging the current release as "$(MDF_BRANCH_TAG)-$(MDF_UTAG)"...'
	$(call tag_and_push,$(MDF_REGISTRY_IMAGE_NAME):$(MDF_UTAG),$(MDF_REGISTRY_IMAGE_NAME):$(MDF_BRANCH_TAG)-$(MDF_UTAG))
	$(call append_artifact_file,MDF_BRANCH_UTAG,$(MDF_BRANCH_TAG)-$(MDF_UTAG))

version-tag: release ## Add this target to `release` to also tag the released image with the version
	@:$(call check_defined, MDF_VERSION_TAG, required to use `version-tag` target)
	@echo 'Tagging the current release as "$(MDF_VERSION_TAG)"...'
	$(call tag_and_push,$(MDF_REGISTRY_IMAGE_NAME):$(MDF_UTAG),$(MDF_REGISTRY_IMAGE_NAME):$(MDF_VERSION_TAG))
	$(call append_artifact_file,MDF_VERSION_TAG,$(MDF_VERSION_TAG))

latest-tag: release ## Add this target to `release` to also tag the released image with the ":latest" tag
	@:$(call check_defined, MDF_VERSION_TAG, required to use `version-tag` target)
	@echo 'Tagging the current release as "latest"...'
	$(call tag_and_push,$(MDF_REGISTRY_IMAGE_NAME):$(MDF_UTAG),$(MDF_REGISTRY_IMAGE_NAME):latest)


#:## Misc
clean: stop rm ## Stop running container and clean related images
	@echo 'Cleaning related images...'
	@[ "$$(docker image ls | grep '^$(MDF_IMAGE_NAME) ')" ] && docker image rm $(MDF_IMAGE_NAME):latest || exit 0

print-utag: ## Print the current unique identifier that will be used for `release`
	@echo $(MDF_UTAG)

print-branch-tag: ## Print the Git branch name that will be used for `branch-tag`
	@echo $(MDF_BRANCH_TAG)

print-version-tag: ## Print the Git version name that will be used for `version-tag`
	@:$(call check_defined, MDF_VERSION_TAG, required to use `version-tag` target)
	@echo $(MDF_VERSION_TAG)

self-update: ## Downloads the latest version of Makedockfile and replace it
	tmpDir=$$(mktemp -d) \
	&& git clone --depth=1 $(MDF_MAKEDOCKFILE_REPOSITORY) $$tmpDir \
	&& cp ./Makefile ./Makefile.bak \
	&& cp $$tmpDir/src/Makefile ./Makefile \
	&& rm -rf $$tmpDir
