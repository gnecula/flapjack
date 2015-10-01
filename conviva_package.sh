#!/bin/bash -eu
#
# Build a package with the current working directory and upload it to /mnt/watchtower/setup/flapjack$1

uploadDir="/mnt/watchtower/setup/flapjack"
function die {
    echo "ERROR: $@"
    exit 1
}

#test $# -ge 1 || die "Must specify a tag for the archive to create (based on current working dir)"
# The name of the archive
tag='conviva_mass_ui_1_6_0'


tag=`echo "$tag" | sed -e 's/[^A-Za-z0-9_-]/_/g'`

uploadArchive="flapjack_$tag.tar.gz"

echo "Will create archive $uploadArchive"

thisdir=`dirname $0`
thisdir=`cd $thisdir && pwd`

cd $thisdir && tar -c -v -z -f /tmp/$uploadArchive lib

echo "Created /tmp/$uploadArchive"

test -d $uploadDir || mkdir -p $uploadDir
 
echo "Copying to $uploadDir/$uploadArchive"
cp -f /tmp/$uploadArchive $uploadDir/$uploadArchive
