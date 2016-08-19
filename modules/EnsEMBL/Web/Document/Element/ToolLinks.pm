=head1 LICENSE

Copyright [2009-2014] EMBL-European Bioinformatics Institute

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

=cut

=head1 MODIFICATIONS

Copyright [2014-2015] University of Edinburgh

All modifications licensed under the Apache License, Version 2.0, as above.

=cut

package EnsEMBL::Web::Document::Element::ToolLinks;

### Generates links to site tools - BLAST, help, login, etc (currently in masthead)

use strict;

sub content {
  my $self    = shift;
  my $hub     = $self->hub;
  my $species = $hub->species;
     $species = !$species || $species eq 'Multi' || $species eq 'common' ? 'Multi' : $species;
  my @links; # = sprintf '<a class="constant" href="%s">Home</a>', $self->home;
#  push @links, qq{<a class="constant" href="/$species/blastview">BLAST</a>} if $self->blast;
###EG
  if ($self->hub->species_defs->ENSEMBL_ENASEARCH_ENABLED) {
      push @links,   '<a class="constant" href="/Multi/enasearch">Sequence Search</a>';
  }

## BEGIN LEPBASE MODIFICATIONS...
  my $sd    = $self->species_defs;
  my $blog  = $sd->ENSEMBL_BLOG_URL;
  push @links,   '<a href="http://blast.blaxterlab.org" title="BLAST"><div class="lb-menu-category"><img title="tools" src="/i/tools-icon.png" class="lb-menu-linkicon"/>BLAST</div></a>';
  push @links,   '<a href="http://download.blaxterlab.org" title="Download"><div class="lb-menu-category"><img title="download" src="/i/download-icon.png" class="lb-menu-linkicon"/>Downloads</div></a>';
  push @links,   '<a href="http://nematodes.org" title="nematodes.org"><div class="lb-menu-category"><img title="nematodes" src="/i/blaxterlab-icon.png" class="lb-menu-linkicon"/>nematodes.org</div></a>';
#  push @links,   '<a href="http://lepbase.org/category/help" title="Help"><div class="lb-menu-category"><img title="lepbase" src="/i/help-icon.png" class="lb-menu-linkicon"/>Help</div></a>';
#  push @links,   '<a class="constant" href="http://webapollo.lepbase.org" title="WebApollo">WebApollo</a>';
#  push @links,   '<a class="constant" href="http://lepbase.org/category/tools/" title="Tools">Tools</a>';

## ...END LEPBASE MODIFICATIONS
  my $tools = join '', @links;
  $tools = '<div class="lb-tools-holder">'.$tools.'</div>';
  return qq{
    $tools
  };
}

1;
