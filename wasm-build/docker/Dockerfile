# This is the last tested version of emscripten.
# Feel free to try with a newer version. 3.1.24 is verified working!
FROM emscripten/emsdk:3.1.24

RUN DEBIAN_FRONTEND=noninteractive apt --no-install-recommends -qy update && \
    DEBIAN_FRONTEND=noninteractive apt --no-install-recommends -qy install \
    docker.io \
    pkg-config \
    ninja-build \
    jq \
    autoconf \
    autoconf-archive \
    automake \
    zlib1g-dev \
    texinfo \
    autopoint \
    gettext \
    clang && \
    DEBIAN_FRONTEND=noninteractive apt --no-install-recommends -qy upgrade
    
# Add to PATH the clang version that ships with emsdk
ENV PATH="${EMSDK}/upstream/bin:${PATH}"

# When running the contianer with a custom user/group, we need to provide that user with
# access to ~/.npm (in this case, /.npm).
# The easiest is to give access to everyone.
RUN mkdir -p /.npm && chmod a+rwx /.npm
