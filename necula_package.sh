#!/bin/bash -eu
#
# Build a package with the current revision and upload it to /mnt/watchtower/setup

uploadDir="/mnt/watchtower/setup/flapjack"
function die {
    echo "ERROR: $@"
    exit 1
}

test $# -ge 1 || die "Must specify a tag for the archive to create (based on current working dir)"
tag=`echo "$1" | sed -e 's/[^A-Za-z0-9_-]/_/g'`

uploadArchive="flapjack_$tag.tar.gz"

echo "Will create archive $uploadArchive"

thisdir=`dirname $0`
thisdir=`cd $thisdir && pwd`

cd $thisdir && tar -c -v -z -f /tmp/$uploadArchive lib

echo "Created /tmp/$uploadArchive"

test -d $uploadDir || mkdir -p $uploadDir
 
echo "Copying to $uploadDir/$uploadArchive"
cp -f /tmp/$uploadArchive $uploadDir/$uploadArchive
